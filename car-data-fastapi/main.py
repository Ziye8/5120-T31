from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from database import query_all, query_one
import logging
from datetime import datetime, timedelta

app = FastAPI(title="FastAPI 数据库示例")

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 允许前端源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有HTTP头
)


# 其他现有接口保持不变...
@app.get("/api/car", summary="获取车辆数据")
async def get_vehicle_data():
    try:
        query = "SELECT State, Year, Value FROM Australian_Bureau_of_Statistics_cleaned"
        result = query_all(query)
        if not result:
            raise HTTPException(status_code=404, detail="未查询到车辆数据")
        return result
    except Exception as e:
        logger.error(f"获取车辆数据失败: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器内部错误，获取数据失败")


class ParkResponse(BaseModel):
    id: int
    name: str


@app.get("/api/park", summary="获取停车场数据", response_model=List[ParkResponse])
async def get_park_data():
    try:
        # 假设查询返回的是(id, name)格式的元组列表
        query = "SELECT ParkingZone, OnStreet FROM parking_zones_linked_to_street_segments"
        result = query_all(query)

        if not result:
            raise HTTPException(status_code=404, detail="未查询到停车场数据")

        # 转换为前端期望的格式：[{id: number, name: string}]
        formatted_result = [
            {"id": item[0], "name": item[1]}
            for item in result
            if item[0] and item[1]  # 过滤掉空值
        ]

        return formatted_result

    except Exception as e:
        logger.error(f"获取车辆数据失败: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器内部错误，获取数据失败")



class AvailabilityResponse(BaseModel):
    time: str
    availability: float


@app.get("/api/history", summary="获取指定时间范围内的停车位状态比例",
         response_model=List[AvailabilityResponse])
async def get_history_data(
        startTimestamp: int = Query(..., description="起始时间戳（毫秒）"),
        endTimestamp: int = Query(..., description="结束时间戳（毫秒）"),
        locationId: int = Query(..., description="停车场 zone id")
):
    try:
        # 验证时间范围
        if startTimestamp >= endTimestamp:
            raise HTTPException(status_code=400, detail="起始时间戳必须小于结束时间戳")

        # 转换毫秒时间戳为datetime对象
        start_dt = datetime.fromtimestamp(startTimestamp / 1000)
        end_dt = datetime.fromtimestamp(endTimestamp / 1000)

        # 计算时间范围内的小时数并生成小时段
        hours_diff = int((end_dt - start_dt).total_seconds() // 3600) + 1
        time_slots = [start_dt + timedelta(hours=i) for i in range(hours_diff)]

        result = []

        # 为每个小时段查询数据
        for time_slot in time_slots:
            # 计算当前小时的开始和结束时间戳（秒）
            slot_start = int(datetime(time_slot.year, time_slot.month, time_slot.day,
                                      time_slot.hour).timestamp())
            slot_end = slot_start + 3600  # 加1小时

            # 查询当前小时内的总记录数
            total_query = """
            SELECT COUNT(*) 
            FROM on_street_parking_bay_sensors 
            WHERE Zone_Number = %s 
              AND Status_Timestamp BETWEEN %s AND %s
              AND Status_Description IN ('Unoccupied', 'Present')
            """
            total_result = query_one(total_query, (locationId, slot_start, slot_end))
            total_count = total_result[0] if total_result else 0

            # 计算空闲率
            if total_count == 0:
                availability = 0.0
            else:
                # 查询空闲状态(Unoccupied)的记录数
                unoccupied_query = """
                SELECT COUNT(*) 
                FROM on_street_parking_bay_sensors 
                WHERE Zone_Number = %s 
                  AND Status_Timestamp BETWEEN %s AND %s
                  AND Status_Description = 'Unoccupied'
                """
                unoccupied_result = query_one(unoccupied_query, (locationId, slot_start, slot_end))
                unoccupied_count = unoccupied_result[0] if unoccupied_result else 0

                # 计算空闲率（转换为百分比）
                availability = round((unoccupied_count / total_count) * 100, 1)

            # 格式化时间字符串（如 "8:00"）
            time_str = f"{time_slot.hour}:00"

            result.append({
                "time": time_str,
                "availability": availability
            })

        return result

    except HTTPException as e:
        # 重新抛出已定义的HTTP异常
        raise e
    except Exception as e:
        logger.error(f"获取历史数据失败: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器内部错误，获取历史数据失败")

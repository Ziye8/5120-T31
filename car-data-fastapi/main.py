from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from database import query_all, query_one
import logging
from datetime import datetime, timedelta

app = FastAPI(title="FastAPI Database Example")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allowed frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)


# Other existing endpoints remain unchanged...
@app.get("/api/car", summary="Get vehicle data")
async def get_vehicle_data():
    try:
        query = "SELECT State, Year, Value FROM Australian_Bureau_of_Statistics_cleaned"
        result = query_all(query)
        if not result:
            raise HTTPException(status_code=404, detail="No vehicle data found")
        return result
    except Exception as e:
        logger.error(f"Failed to get vehicle data: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Internal server error, failed to get data"
        )


class ParkResponse(BaseModel):
    id: int
    name: str


@app.get(
    "/api/park", summary="Get parking zone data", response_model=List[ParkResponse]
)
async def get_park_data():
    try:
        # Assuming the query returns a list of tuples in (id, name) format
        query = (
            "SELECT ParkingZone, OnStreet FROM parking_zones_linked_to_street_segments"
        )
        result = query_all(query)

        if not result:
            raise HTTPException(status_code=404, detail="No parking zone data found")

        # Convert to the format expected by the frontend: [{id: number, name: string}]
        formatted_result = [
            {"id": item[0], "name": item[1]}
            for item in result
            if item[0] and item[1]  # Filter out null values
        ]

        return formatted_result

    except Exception as e:
        logger.error(f"Failed to get parking zone data: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Internal server error, failed to get data"
        )


class AvailabilityResponse(BaseModel):
    time: str
    availability: float


@app.get(
    "/api/history",
    summary="Get parking availability ratio within a specific time range",
    response_model=List[AvailabilityResponse],
)
async def get_history_data(
    startTimestamp: int = Query(..., description="Start timestamp (milliseconds)"),
    endTimestamp: int = Query(..., description="End timestamp (milliseconds)"),
    locationId: int = Query(..., description="Parking zone id"),
):
    try:
        # Validate the time range
        if startTimestamp >= endTimestamp:
            raise HTTPException(
                status_code=400,
                detail="Start timestamp must be less than end timestamp",
            )

        # Convert millisecond timestamps to datetime objects
        start_dt = datetime.fromtimestamp(startTimestamp / 1000)
        end_dt = datetime.fromtimestamp(endTimestamp / 1000)

        # Calculate the number of hours in the time range and generate hourly slots
        hours_diff = int((end_dt - start_dt).total_seconds() // 3600) + 1
        time_slots = [start_dt + timedelta(hours=i) for i in range(hours_diff)]

        result = []

        # Query data for each hourly slot
        for time_slot in time_slots:
            # Calculate start and end timestamp (seconds) for the current hour
            slot_start = int(
                datetime(
                    time_slot.year, time_slot.month, time_slot.day, time_slot.hour
                ).timestamp()
            )
            slot_end = slot_start + 3600  # +1 hour

            # Query total number of records within the current hour
            total_query = """
            SELECT COUNT(*) 
            FROM on_street_parking_bay_sensors 
            WHERE Zone_Number = %s 
              AND Status_Timestamp BETWEEN %s AND %s
              AND Status_Description IN ('Unoccupied', 'Present')
            """
            total_result = query_one(total_query, (locationId, slot_start, slot_end))
            total_count = total_result[0] if total_result else 0

            # Calculate availability rate
            if total_count == 0:
                availability = 0.0
            else:
                # Query number of records with "Unoccupied" status
                unoccupied_query = """
                SELECT COUNT(*) 
                FROM on_street_parking_bay_sensors 
                WHERE Zone_Number = %s 
                  AND Status_Timestamp BETWEEN %s AND %s
                  AND Status_Description = 'Unoccupied'
                """
                unoccupied_result = query_one(
                    unoccupied_query, (locationId, slot_start, slot_end)
                )
                unoccupied_count = unoccupied_result[0] if unoccupied_result else 0

                # Calculate availability rate (percentage)
                availability = round((unoccupied_count / total_count) * 100, 1)

            # Format time string (e.g., "8:00")
            time_str = f"{time_slot.hour}:00"

            result.append({"time": time_str, "availability": availability})

        return result

    except HTTPException as e:
        # Re-raise defined HTTP exceptions
        raise e
    except Exception as e:
        logger.error(f"Failed to get historical data: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error, failed to get historical data",
        )

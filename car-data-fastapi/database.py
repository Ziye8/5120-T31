from pymysql import connect, cursors
from pymysql.cursors import DictCursor
from pymysql.err import OperationalError
from contextlib import contextmanager
import logging
from typing import Generator, Any, Dict

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 数据库配置 - 这里换成自己的数据
DB_CONFIG: Dict[str, Any] = {
    "host": "100.153.1.101",
    "user": "root",
    "password": "Password123@mysql",
    "database": "park",
    "port": 3306,
}


def get_db_connection():
    """获取数据库连接"""
    try:
        conn = connect(**DB_CONFIG)
        logger.info("数据库连接成功")
        return conn
    except OperationalError as e:
        logger.error(f"数据库连接失败: {str(e)}")
        raise


@contextmanager
def db_cursor() -> Generator[cursors.Cursor, None, None]:
    """
    数据库游标上下文管理器
    自动处理连接获取、游标创建、提交、回滚和关闭
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        yield cursor
        conn.commit()
        logger.info("事务提交成功")
    except Exception as e:
        if conn:
            conn.rollback()
            logger.error(f"事务回滚: {str(e)}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            logger.info("数据库连接已关闭")


def query_one(sql: str, params: tuple = None) -> Dict[str, Any]:
    """查询单条记录"""
    with db_cursor() as cursor:
        cursor.execute(sql, params or ())
        return cursor.fetchone()


def query_all(sql: str, params: tuple = None) -> list[Dict[str, Any]]:
    """查询多条记录"""
    with db_cursor() as cursor:
        cursor.execute(sql, params or ())
        return cursor.fetchall()


def execute(sql: str, params: tuple = None) -> int:
    """执行插入、更新、删除操作，返回受影响的行数"""
    with db_cursor() as cursor:
        cursor.execute(sql, params or ())
        return cursor.rowcount

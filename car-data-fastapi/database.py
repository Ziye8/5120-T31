from pymysql import connect, cursors
from pymysql.cursors import DictCursor
from pymysql.err import OperationalError
from contextlib import contextmanager
import logging
from typing import Generator, Any, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG: Dict[str, Any] = {
    "host": "parking-db.cmpgwg4ekzvl.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "Wa5b!cC)I4*~p-N:6h-nTM886lI",
    "database": "parking-db",
    "port": 3306,
}


def get_db_connection():
    """Get database connection"""
    try:
        conn = connect(**DB_CONFIG)
        logger.info("Successfully connected to the database")
        return conn
    except OperationalError as e:
        logger.error(f"Failed to connect to the database: {str(e)}")
        raise


@contextmanager
def db_cursor() -> Generator[cursors.Cursor, None, None]:
    """
    Database cursor context manager
    Automatically handles connection acquisition, cursor creation, commit, rollback, and closure
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        yield cursor
        conn.commit()
        logger.info("Transaction committed successfully")
    except Exception as e:
        if conn:
            conn.rollback()
            logger.error(f"Transaction rolled back: {str(e)}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            logger.info("Database connection closed")


def query_one(sql: str, params: tuple = None) -> Dict[str, Any]:
    """Query a single record"""
    with db_cursor() as cursor:
        cursor.execute(sql, params or ())
        return cursor.fetchone()


def query_all(sql: str, params: tuple = None) -> list[Dict[str, Any]]:
    """Query multiple records"""
    with db_cursor() as cursor:
        cursor.execute(sql, params or ())
        return cursor.fetchall()


def execute(sql: str, params: tuple = None) -> int:
    """Execute insert, update, delete operations and return the number of affected rows"""
    with db_cursor() as cursor:
        cursor.execute(sql, params or ())
        return cursor.rowcount

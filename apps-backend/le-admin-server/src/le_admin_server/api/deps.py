from lee_db import make_session_dependency

from le_admin_server.database import AsyncSessionLocal

get_db_session = make_session_dependency(AsyncSessionLocal)

__all__ = ["get_db_session"]

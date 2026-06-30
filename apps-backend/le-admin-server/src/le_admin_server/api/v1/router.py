from fastapi import APIRouter
from lee_api_core import SuccessResponse, success

from le_admin_server.modules.users.routes import router as users_router

router = APIRouter()
router.include_router(users_router, prefix="/users", tags=["users"])


@router.get("/ping", tags=["system"], response_model=SuccessResponse[dict[str, str]])
async def ping() -> SuccessResponse[dict[str, str]]:
    return success({"service": "le-admin-server"})

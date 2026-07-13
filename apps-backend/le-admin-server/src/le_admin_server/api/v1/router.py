from fastapi import APIRouter
from lee_api_core import SuccessResponse, success

from le_admin_server.modules.applications.routes import router as applications_router
from le_admin_server.modules.auth.routes import router as auth_router
from le_admin_server.modules.organizations.routes import router as organizations_router
from le_admin_server.modules.permissions.routes import router as permissions_router
from le_admin_server.modules.roles.routes import router as roles_router
from le_admin_server.modules.users.routes import router as users_router

router = APIRouter()
router.include_router(
    applications_router,
    prefix="/applications",
    tags=["applications"],
)
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(
    organizations_router,
    prefix="/organizations",
    tags=["organizations"],
)
router.include_router(permissions_router, prefix="/permissions", tags=["permissions"])
router.include_router(roles_router, prefix="/roles", tags=["roles"])
router.include_router(users_router, prefix="/users", tags=["users"])


@router.get("/ping", tags=["system"], response_model=SuccessResponse[dict[str, str]])
async def ping() -> SuccessResponse[dict[str, str]]:
    return success({"service": "le-admin-server"})

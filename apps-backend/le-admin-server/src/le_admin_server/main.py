from .app import create_app

app = create_app()


def run(host: str = "127.0.0.1", port: int = 8000, reload: bool = False) -> None:
    import uvicorn

    uvicorn.run(
        "le_admin_server.main:app",
        host=host,
        port=port,
        reload=reload,
    )


if __name__ == "__main__":
    run(reload=True)

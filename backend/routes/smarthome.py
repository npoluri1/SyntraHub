from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List

from backend.database.connection import get_db
from backend.database.models import SmartDevice, SmartScene, User
from backend.models.schemas import (
    SmartDeviceCreate, SmartDeviceResponse,
    SmartSceneCreate, SmartSceneResponse,
    DeviceCommand,
)

router = APIRouter(prefix="/api/smarthome", tags=["Smart Home"])


@router.get("/devices", response_model=List[SmartDeviceResponse])
def get_devices(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(SmartDevice).filter(
        SmartDevice.user_id == user_id, SmartDevice.is_active == True
    ).all()


@router.post("/devices", response_model=SmartDeviceResponse)
def add_device(data: SmartDeviceCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    device = SmartDevice(user_id=user_id, **data.model_dump())
    device.status = "online"
    device.state = {"power": "off"}
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


@router.get("/devices/{device_id}", response_model=SmartDeviceResponse)
def get_device(device_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    device = db.query(SmartDevice).filter(
        SmartDevice.id == device_id, SmartDevice.user_id == user_id
    ).first()
    if not device:
        raise HTTPException(404, "Device not found")
    return device


@router.delete("/devices/{device_id}")
def remove_device(device_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    device = db.query(SmartDevice).filter(
        SmartDevice.id == device_id, SmartDevice.user_id == user_id
    ).first()
    if not device:
        raise HTTPException(404, "Device not found")
    device.is_active = False
    db.commit()
    return {"message": "Device removed"}


@router.post("/devices/{device_id}/command")
def send_command(device_id: int, data: DeviceCommand, user_id: int = Query(1), db: Session = Depends(get_db)):
    device = db.query(SmartDevice).filter(
        SmartDevice.id == device_id, SmartDevice.user_id == user_id
    ).first()
    if not device:
        raise HTTPException(404, "Device not found")

    cmd = data.command.lower()
    if cmd == "toggle":
        current = device.state.get("power", "off")
        device.state["power"] = "on" if current == "off" else "off"
    elif cmd == "on":
        device.state["power"] = "on"
    elif cmd == "off":
        device.state["power"] = "off"
    elif cmd == "set":
        device.state.update(data.params)
    elif cmd == "status":
        pass
    else:
        raise HTTPException(400, f"Unknown command: {cmd}")

    device.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(device)
    return {"status": "ok", "device_state": device.state}


@router.get("/scenes", response_model=List[SmartSceneResponse])
def get_scenes(user_id: int = Query(1), db: Session = Depends(get_db)):
    return db.query(SmartScene).filter(
        SmartScene.user_id == user_id, SmartScene.is_active == True
    ).all()


@router.post("/scenes", response_model=SmartSceneResponse)
def create_scene(data: SmartSceneCreate, user_id: int = Query(1), db: Session = Depends(get_db)):
    scene = SmartScene(user_id=user_id, **data.model_dump())
    db.add(scene)
    db.commit()
    db.refresh(scene)
    return scene


@router.delete("/scenes/{scene_id}")
def delete_scene(scene_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    scene = db.query(SmartScene).filter(
        SmartScene.id == scene_id, SmartScene.user_id == user_id
    ).first()
    if not scene:
        raise HTTPException(404, "Scene not found")
    db.delete(scene)
    db.commit()
    return {"message": "Scene deleted"}


@router.post("/scenes/{scene_id}/activate")
def activate_scene(scene_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    scene = db.query(SmartScene).filter(
        SmartScene.id == scene_id, SmartScene.user_id == user_id
    ).first()
    if not scene:
        raise HTTPException(404, "Scene not found")
    for action in scene.actions:
        device_id = action.get("device_id")
        cmd = action.get("command", "toggle")
        params = action.get("params", {})
        if device_id:
            device = db.query(SmartDevice).filter(SmartDevice.id == device_id).first()
            if device:
                if cmd == "on":
                    device.state["power"] = "on"
                elif cmd == "off":
                    device.state["power"] = "off"
                else:
                    device.state.update(params)
                device.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": f"Scene '{scene.name}' activated"}

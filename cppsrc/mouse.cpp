#include "mouse.h"
#include <windows.h>

std::string mouse::getMousePos(){
    POINT p;
    if (GetCursorPos(&p))
    {
        return "{\"x\":" + std::to_string(p.x) + "," + "\"y\":" + std::to_string(p.y) + "}"  ;//cursor position now in p.x and p.y
    }
    return nullptr;
}

Napi::String mouse::GetMousePosWrapped(const Napi::CallbackInfo& info) 
{
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, mouse::getMousePos());
  
  return returnValue;
}

Napi::Object mouse::Init(Napi::Env env, Napi::Object exports) 
{
  exports.Set(
    "getMousePos", Napi::Function::New(env, mouse::GetMousePosWrapped)
  );
 
  return exports;
}
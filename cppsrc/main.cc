#include <napi.h>
#include <windows.h>
#include <stdio.h>

Napi::Object GetMousePos(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  POINT p;
  Napi::Object obj = Napi::Object::New(env);
  if (GetCursorPos(&p))
  {
    obj.Set(Napi::String::New(env, "x"), p.x);
    obj.Set(Napi::String::New(env, "y"), p.y);
  }
  return obj;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "getMousePos"), Napi::Function::New(env, GetMousePos));
  return exports;
}

NODE_API_MODULE(addon, Init)
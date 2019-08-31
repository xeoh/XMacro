#include <napi.h>

namespace mouse {
  std::string getMousePos();
  Napi::String GetMousePosWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}
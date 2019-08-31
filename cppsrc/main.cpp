#include <napi.h>
#include "mouse.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return mouse::Init(env, exports);
}

NODE_API_MODULE(nativeio, InitAll)
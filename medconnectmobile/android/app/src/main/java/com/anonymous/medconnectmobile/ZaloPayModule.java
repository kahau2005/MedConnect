package com.anonymous.medconnectmobile;
import android.app.Activity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import vn.zalopay.sdk.Environment;
import vn.zalopay.sdk.ZaloPayError;
import vn.zalopay.sdk.ZaloPaySDK;
import vn.zalopay.sdk.listeners.PayOrderListener;

public class ZaloPayModule extends ReactContextBaseJavaModule {

    public ZaloPayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ZaloPaySDK.init(2553, Environment.SANDBOX);
    }

    @Override
    public String getName() {
        return "ZaloPayModule";
    }

    @ReactMethod
    public void payOrder(String zpTransToken, Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("ACTIVITY_ERROR", "Activity không tồn tại");
            return;
        }

        ZaloPaySDK.getInstance().payOrder(currentActivity, zpTransToken, "demozpdk://app", new PayOrderListener() {
            @Override
            public void onPaymentSucceeded(String transactionId, String transToken, String appTransID) {
                promise.resolve("SUCCESS");
            }

            @Override
            public void onPaymentCanceled(String zpTransToken, String appTransID) {
                promise.reject("CANCELED", "Người dùng hủy thanh toán");
            }

            @Override
            public void onPaymentError(ZaloPayError zaloPayError, String zpTransToken, String appTransID) {
                promise.reject("ERROR", "Thanh toán thất bại: " + zaloPayError.toString());
            }
        });
    }
}

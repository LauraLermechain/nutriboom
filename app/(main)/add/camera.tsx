import React from "react";
import { View, Text, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Autorisation caméra
        </Text>
        <Text>On a besoin de la caméra pour scanner un code-barres.</Text>

        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: "#0a7ea4",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Autoriser la caméra
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
        }}
        onBarcodeScanned={(result) => {
          if (scanned) return;
          setScanned(true);

          router.replace(`/(main)/add/product?barcode=${encodeURIComponent(result.data)}`);
        }}
      />

      {scanned && (
        <View style={{ position: "absolute", bottom: 30, left: 20, right: 20 }}>
          <Pressable
            onPress={() => setScanned(false)}
            style={{
              backgroundColor: "black",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Scanner à nouveau
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

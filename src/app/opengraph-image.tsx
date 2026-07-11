import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F1F2EF",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "#161A1F",
            marginBottom: 24,
          }}
        >
          DocQuery
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#5B6167",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Ask your documents, get sentence-level answers
        </div>
        <div
          style={{
            width: 4,
            height: 120,
            backgroundColor: "#3557D6",
            marginTop: 48,
            opacity: 0.6,
          }}
        />
      </div>
    ),
    { ...size },
  );
}

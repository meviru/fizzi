"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, View } from "@react-three/drei";
import FloatingCan from "@/components/FloatingCan";

type Props = {}

export default function ViewCanvas({ }: Props) {
    return (
        <Canvas style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 30,
            overflow: "hidden"
        }}
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true }}
            camera={{
                fov: 30,
            }}
        >
            <View.Port />
        </Canvas>
    )
}
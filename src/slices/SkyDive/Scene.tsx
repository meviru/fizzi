"use client"

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGSAP } from "@gsap/react";
import { Content } from "@prismicio/client";
import { Cloud, Clouds, Environment, OrbitControls, Text } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react"
import * as THREE from "three";


gsap.registerPlugin(useGSAP, ScrollTrigger);

type SkyDiveProps = {
    sentence: string | null;
    flavor: Content.SkyDiveSliceDefaultPrimary["flavor"]
}

export default function Scene({ sentence, flavor }: SkyDiveProps) {
    const groupRef = useRef<THREE.Group>(null);
    const canRef = useRef<THREE.Group>(null);
    const cloud1Ref = useRef<THREE.Group>(null);
    const cloud2Ref = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Group>(null);
    const wordsRef = useRef<THREE.Group>(null);

    const ANGLE = 75 * (Math.PI / 180);

    const getXPosition = (distance: number) => distance * Math.cos(ANGLE);
    const getYPosition = (distance: number) => distance * Math.sin(ANGLE);

    const getXYPosition = (distance: number) => ({
        x: getXPosition(distance),
        y: getYPosition(-1 * distance)
    });

    useGSAP(() => {
        if (
            !cloudsRef.current ||
            !canRef.current ||
            !wordsRef.current ||
            !cloud1Ref.current ||
            !cloud2Ref.current
        ) { return; }

        // Set inital position
        gsap.set(cloudsRef.current.position, { z: 10 });
        gsap.set(canRef.current.position, {
            ...getXYPosition(-4),
        })
        gsap.set(wordsRef.current.children.map((word) => word.position), {
            ...getXYPosition(7), z: 2
        })

        // Spinning can
        gsap.to(canRef.current.rotation, {
            y: Math.PI * 2,
            duration: 1.7,
            repeat: -1,
            ease: "none"
        })

        // Infinite cloud movement
        const DISTANCE = 15;
        const DURATION = 6;

        gsap.set([cloud2Ref.current.position, cloud1Ref.current.position], {
            ...getXYPosition(DISTANCE)
        })

        gsap.to(cloud1Ref.current.position, {
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: "none",
            repeat: -1,
            duration: DURATION
        })

        gsap.to(cloud2Ref.current.position, {
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: "none",
            repeat: -1,
            delay: DURATION / 2,
            duration: DURATION
        })

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".skydive",
                pin: true,
                start: "top top",
                end: "+=2000",
                scrub: 1.5
            }
        })

        scrollTl
            .to("body", {
                backgroundColor: "#C0F0F5",
                overwrite: "auto",
                duration: 0.1
            })
            .to(cloudsRef.current.position, { z: 0, duration: 0.3 }, 0)
            .to(canRef.current.position, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "back.out(1.7)"
            })
    })

    return (
        <group ref={groupRef}>
            <group rotation={[0, 0, 0.5]}>
                <FloatingCan ref={canRef}
                    flavor={flavor}
                    rotationIntensity={0}
                    floatIntensity={3}
                    floatSpeed={3}
                ></FloatingCan>
            </group>

            <Clouds ref={cloudsRef}>
                <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
                <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
            </Clouds>

            <group ref={wordsRef}>
                {sentence && <ThreeText sentence={sentence} color="#f97315" />}
            </group>

            <ambientLight intensity={2} color="#9ddefa" />
            <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
        </group>
    )
}

function ThreeText({ sentence, color = "white" }: { sentence: string, color: string }) {
    const words = sentence.toUpperCase().split(" ");
    const material = new THREE.MeshLambertMaterial();
    const isDesktop = useMediaQuery("(min-width: 950px)", true);

    return words.map((word: string, wordIndex: number) => (
        <Text key={`word${wordIndex}-${word}`}
            scale={isDesktop ? 1 : 0.5}
            color={color}
            material={material}
            font="/fonts/Alpino-Variable.woff"
            fontWeight={900}
            anchorX={"center"}
            anchorY={"middle"}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,.?'"
        >
            {word}
        </Text>
    ));
}
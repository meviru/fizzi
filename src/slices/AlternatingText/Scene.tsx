"use client"

import { useGSAP } from "@gsap/react"
import { Environment } from "@react-three/drei"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"
import { Group } from "three"

import FloatingCan from "@/components/FloatingCan"

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {}

export default function Scene({ }: Props) {

    const canRef = useRef<Group>(null);
    const bgColors = ["#FFA6B5", "#E9CFF6", "#CBEF9A"];

    useGSAP(() => {
        if (!canRef.current) { return }

        const sections = gsap.utils.toArray(".alternating-section");

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.alternating-text-view',
                endTrigger: '.alternating-text-container',
                pin: true,
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        })

        sections.forEach((_, index) => {
            if (!canRef.current) return
            if (index === 0) return

            const isOdd = index % 2 !== 0;

            scrollTl.to(canRef.current.position, {
                x: isOdd ? "-1" : "1",
                ease: "circ.inOut",
                delay: 0.5
            })

        })
    })

    return (
        <group ref={canRef} position-x={1} rotation-y={-0.3}>
            <FloatingCan flavor="strawberryLemonade" />
            <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
        </group>
    )
}
"use client";
import dynamic from "next/dynamic";

const RankedPlacesMap = dynamic(() => import("./RankedPlacesMap"), { ssr: false });

export default RankedPlacesMap;

"use client";

import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import {
	Sidebar,
	
} from "@/components/ui/sidebar";
import Link from "next/link";



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<Link href={"/"} className="text-black font-[500] mt-6 px-4">Users</Link>

		</Sidebar>
	);
}

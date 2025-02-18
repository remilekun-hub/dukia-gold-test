"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import useDebounce from "./hooks/useDebounce";
import { useState } from "react";
import { User } from "@/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Home() {
	const [query, setQuery] = useState("");
	const deBounceValue = useDebounce(query, 1000);

	const getUsers = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			try {
				const data: { data: User[] } = await axios.get(
					"https://jsonplaceholder.typicode.com/users"
				);
				return data;
			} catch (error) {
				if (isAxiosError(error)) {
					const errorData = error.response
						? error.response.data.message
						: error.message;
					toast.error(errorData);
					throw new Error(errorData);
				}
			}
		},
	});
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalUsers = getUsers?.data?.data ? getUsers?.data?.data.length : 0;
	const totalPages = Math.ceil(totalUsers / itemsPerPage);

	const indexOfLastUser = currentPage * itemsPerPage;
	const indexOfFirstUser = indexOfLastUser - itemsPerPage;
	const currentUsers = getUsers?.data?.data
		? getUsers?.data?.data.slice(indexOfFirstUser, indexOfLastUser)
		: [];
	const filter = (): User[] => {
		let data = currentUsers;
		if (deBounceValue && getUsers.data?.data) {
			data = getUsers?.data?.data.filter((user) =>
				user.name.toLowerCase().includes(deBounceValue.toLowerCase())
			).slice(indexOfFirstUser, indexOfLastUser);

			return data;
		}
		return data || [];
	};

	if (getUsers.isPending) {
		return (
			<div className="flex justify-center items-center h-[100dvh]">
				<Loader2 className="animate-spin w-[40px] h-[40px] text-center stroke-3" />
			</div>
		);
	}

	if (getUsers.isError) {
		return (
			<div>
				<h1 className="text-center text-3xl">
					{getUsers.error.message || "error fetching data"}
				</h1>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex border h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
            <h1>Users Page</h1>
					</div>
				</header>
				<div className="p-4">
					<div>
						<input
							type="text"
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								setCurrentPage(1);
							}}
							className="outline-none rounded-[8px] h-[45px] border-[2px] border-gray-300 p-3 w-full max-w-[400px]"
							placeholder="search for users"
						/>
					</div>

					<h1 className="mt-2">All users</h1>
					<Table className="border-[2px] mt-6 rounded-[3px]">
						<TableHeader className="border-[2px]">
							<TableRow className="">
								<TableHead className="text-left">Name</TableHead>
								<TableHead className="text-center">Surname</TableHead>
								<TableHead className="text-center">Email</TableHead>
								<TableHead className="text-center">Phone</TableHead>
								<TableHead className="text-right">Address</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filter().map((user, i: number) => {
								return (
									<TableRow key={i} className="h-[40px]">
										<TableCell className="font-medium">
											{user?.name}
										</TableCell>
										<TableCell className="text-center">
											{user?.username}
										</TableCell>
										<TableCell className="text-center">
											{user?.email}
										</TableCell>
										<TableCell className="text-center">
											{user?.phone}
										</TableCell>

										<TableCell className="text-right">
											{user?.address.city}, {user?.address?.city},
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>

					<div className="flex justify-center items-center gap-4 mt-5">
						<button
							onClick={() => setCurrentPage((cur) => cur - 1)}
							disabled={currentPage === 1}
						>
							Prev
						</button>

						{currentPage}  of {totalPages}
						
						<button
							onClick={() => setCurrentPage((cur) => cur + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

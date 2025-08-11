import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from "@/components/ui/sidebar";

interface SearchFormProps extends React.ComponentProps<"form"> {
	onSearch?: (query: string) => void;
	onClear?: () => void;
}

export function SearchForm({ onSearch, onClear, ...props }: SearchFormProps) {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(query);
	};

	const handleClear = () => {
		setQuery("");
		onClear?.();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		// Search as user types
		onSearch?.(value);
	};

	return (
		<form onSubmit={handleSubmit} {...props}>
			<SidebarGroup className="py-0">
				<SidebarGroupContent className="relative">
					<Label htmlFor="search" className="sr-only">
						Search workflows
					</Label>
					<SidebarInput
						id="search"
						placeholder="Search workflows..."
						className="pl-8 pr-8"
						value={query}
						onChange={handleChange}
					/>
					<Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
					{query && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute top-1/2 right-1 size-6 p-0 -translate-y-1/2 hover:bg-muted"
							onClick={handleClear}
						>
							<X className="size-3" />
							<span className="sr-only">Clear search</span>
						</Button>
					)}
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	);
}

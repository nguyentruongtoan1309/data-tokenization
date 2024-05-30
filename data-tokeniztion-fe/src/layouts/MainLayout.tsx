import Header from '@/components/header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<div className="h-screen flex flex-col">
			<Header />

			<main className="flex-1">
				<Outlet />
			</main>
			
			<div className="h-16 flex items-center justify-center text-white">
				&copy;2024 - Team 116 - Nguyen Truong Toan, Le Tung Nghia, Cao Nhu Ngoc. All rights reserved.
			</div>
		</div>
	);
}

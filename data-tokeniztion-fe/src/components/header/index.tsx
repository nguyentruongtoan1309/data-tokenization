import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppUpdater } from '@/contexts/AppContext';
import classes from './header.module.scss';

const Header = () => {
	const { setTheme } = useAppUpdater();

	return (
		<header className="shadow-lg shadow-b-2.5 -shadow-spread-1 shadow-slate-900/10 bg-[#00b74f]">
			<div className="h-16 container grid grid-cols-[250px_1fr_250px]">
				<div className='overflow-hidden relative'>
					<div className={`${classes.logo} ${classes.vpb}`}></div>
					<div className={`${classes.logo} ${classes.aws}`}></div>
				</div>
				<div className={classes.title}>VPBank Technology Hackathon</div>
				<div className="ml-auto flex items-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="border-white text-white hover:bg-white dark:hover:text-[#333]">
								<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};

export default Header;

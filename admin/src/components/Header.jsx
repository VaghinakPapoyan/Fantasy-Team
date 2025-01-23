import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
	return (
		<header>
			<nav className='navbar'>
				<ul className='nav-links'>
					<li>
						<NavLink
							to='/dashboard'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Dashboard
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/users'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Users
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/leagues'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Leagues
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/feedbacks'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Feedbacks
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/badges'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Badges
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/prizes'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Prizes
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/boosters'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Boosters
						</NavLink>
					</li>
				</ul>
				<div className='nav-links'>
					<NavLink
						to='/login'
						className={({ isActive }) => (isActive ? 'active' : '')}
					>
						Login
					</NavLink>
				</div>
			</nav>
		</header>
	)
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Users from './Users/Users.jsx'
import UserLeague from './User League/UserLeague.jsx'
import Leagues from './Leagues/Leagues.jsx'
import League from './League/League.jsx'
import LeagueUsers from './League/LeagueUsers.jsx'
import LeagueClubs from './League/LeagueClubs.jsx'
import LeaguePlayers from './League/LeaguePlayers.jsx'
import LeagueClub from './League/LeagueClub.jsx'
import Feedbacks from './Feedbacks/Feedbacks.jsx'
import Badges from './Badges/Badges.jsx'
import Badge from './Badge/Badge.jsx'
import Prizes from './Prizes/Prizes.jsx'
import Prize from './Prize/Prize.jsx'
import Boosters from './Boosters/Boosters.jsx'
import Booster from './Booster/Booster.jsx'
import LeaguePlayer from './League/LeaguePlayer.jsx'
import User from './User/User.jsx'
import Login from './Login/Login.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header.jsx'

const AdminRoutes = () => {
	return (
		<Router>
			<Header />
			<ErrorBoundary>
				<Routes>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/login' element={<Login />} />
					<Route path='/users' element={<Users />} />
					<Route path='/users/:id' element={<User />} />
					<Route path='/create-user' element={<User />} />
					<Route path='/leagues' element={<Leagues />} />
					<Route path='/leagues/:id' element={<League />} />
					<Route path='/leagues/users/:id' element={<LeagueUsers />} />
					<Route path='/leagues/clubs/:id' element={<LeagueClubs />} />
					<Route path='/leagues/players/:id' element={<LeaguePlayers />} />
					<Route path='/leagues/clubs/:id/:clubId' element={<LeagueClub />} />
					<Route
						path='/leagues/players/:id/:playerId'
						element={<LeaguePlayer />}
					/>
					<Route path='/feedbacks' element={<Feedbacks />} />
					<Route path='/badges' element={<Badges />} />
					<Route path='/badge/:id' element={<Badge />} />
					<Route path='/badge' element={<Badge />} />
					<Route path='/prizes' element={<Prizes />} />
					<Route path='/prize/:id' element={<Prize />} />
					<Route path='/prize' element={<Prize />} />
					<Route path='/boosters' element={<Boosters />} />
					<Route path='/booster/:id' element={<Booster />} />
					<Route path='/booster' element={<Booster />} />
					<Route
						path='/user-league/:leagueId/:userId'
						element={<UserLeague />}
					/>

					{/* Redirect all other routes */}
					{/* <Route path='*' element={<Navigate to='/login' />} /> */}
				</Routes>
			</ErrorBoundary>
		</Router>
	)
}

export default AdminRoutes

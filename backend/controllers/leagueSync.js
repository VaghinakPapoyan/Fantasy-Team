// Import necessary modules
import axios from 'axios'
import League from '../models/League.js'
import Club from '../models/Club.js'
import FootballPlayer from '../models/FootballPlayer.js'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Function to sync data for multiple leagues
export default async function syncAllLeagues(req, res) {
	await syncLeague('PL') // Sync Premier League
	await syncLeague('PD') // Sync La Liga
	await syncLeague('CL') // Sync UEFA Champions League
	await syncLeague('BL1') // Sync Bundesliga
	await syncLeague('SA') // Sync Serie A
	return res.status(200).json({
		message: 'Leagues, clubs, and players data synced successfully.',
	})
}

// Function to sync data for a specific league
async function syncLeague(leagueCode) {
	try {
		const API_KEY = process.env.FOOTBALL_API_KEY
		const BASE_URL = 'https://api.football-data.org/v4'
		const headers = { 'X-Auth-Token': API_KEY }

		// Fetch league information
		const leagueResponse = await axios.get(
			`${BASE_URL}/competitions/${leagueCode}`,
			{
				headers,
			}
		)
		const leagueData = leagueResponse.data
		const currentSeason = leagueData.currentSeason
		const seasonYear = currentSeason.startDate.substring(0, 4)

		// Fetch all matches for the competition
		const matchesResponse = await axios.get(
			`${BASE_URL}/competitions/${leagueCode}/matches`,
			{ headers }
		)
		const matches = matchesResponse.data.matches

		// Group matches by matchday
		const matchesByMatchday = {}
		matches.forEach(match => {
			const matchday = match.matchday
			if (!matchesByMatchday[matchday]) {
				matchesByMatchday[matchday] = []
			}
			matchesByMatchday[matchday].push(match)
		})

		// Build gameWeeks array, each representing a matchday
		const gameWeeks = []
		for (const matchday in matchesByMatchday) {
			const fixtures = matchesByMatchday[matchday]

			// Get startDate and endDate for the game week by finding the min and max date of all matches
			const dates = fixtures.map(f => new Date(f.utcDate))
			const startDate = new Date(Math.min(...dates))
			const endDate = new Date(Math.max(...dates))

			// Create gameWeek object with fixtures and date range
			gameWeeks.push({
				fixturesStandings: fixtures,
				startDate: startDate,
				endDate: endDate,
			})
		}

		// Construct newLeagueData object with all league details
		const newLeagueData = {
			leagueName: leagueData.name,
			leagueId: leagueData.code,
			leagueType: 'public',
			status: currentSeason.winner ? 'completed' : 'active',
			country: {
				name: leagueData.area.name,
				code: leagueData.area.code,
			},
			season: seasonYear,
			startDate: new Date(currentSeason.startDate),
			endDate: new Date(currentSeason.endDate),
			timezone: 'UTC',
			description: `${leagueData.name} ${seasonYear}`,
			price: 0,
			entryDeadline: new Date(currentSeason.startDate),
			apiProvider: {
				name: 'football-data.org',
				baseUrl: BASE_URL,
				apiKey: API_KEY,
			},
			lastSyncTime: new Date(),
			syncFrequency: 60,
			imageLink: leagueData.emblem,
			gameWeeks: gameWeeks,
			closed: !!currentSeason.winner,
			clubs: [],
			players: [],
		}

		// Save or update league data in the database
		let existingLeague = await League.findOne({ leagueId: leagueData.code })
		if (existingLeague) {
			await League.updateOne(
				{ leagueId: leagueData.code },
				{ $set: newLeagueData }
			)
			existingLeague = await League.findOne({ leagueId: leagueData.code }) // Refresh league data
			console.log('League data updated successfully.')
		} else {
			const newLeague = new League(newLeagueData)
			await newLeague.save()
			existingLeague = newLeague
			console.log('League data saved successfully.')
		}

		// Fetch teams participating in the competition
		const teamsResponse = await axios.get(
			`${BASE_URL}/competitions/${leagueCode}/teams`,
			{
				headers,
			}
		)
		const teams = teamsResponse.data.teams

		// Iterate over each team to save/update their information
		for (const team of teams) {
			const clubData = {
				clubName: team.name,
				clubId: team.id, // Use unique team.id
				shortName: team.shortName,
				tla: team.tla,
				crestUrl: team.crest,
				address: team.address,
				phone: team.phone,
				website: team.website,
				email: team.email,
				founded: team.founded,
				clubColors: team.clubColors,
				venue: team.venue,
				players: [], // Initialize empty players array
			}

			// Save or update club data in the database
			let existingClub = await Club.findOne({ clubId: team.id })
			let clubId

			if (existingClub) {
				await Club.updateOne({ clubId: team.id }, { $set: clubData })
				existingClub = await Club.findOne({ clubId: team.id }) // Refresh club data
				clubId = existingClub._id
				console.log(`Club data updated: ${team.name}`)
			} else {
				const newClub = new Club(clubData)
				await newClub.save()
				clubId = newClub._id
				existingClub = newClub
				console.log(`Club data saved: ${team.name}`)
			}

			// Add club to the league's clubs array if not already present
			await League.updateOne(
				{ leagueId: leagueData.code },
				{ $addToSet: { clubs: clubId } }
			)

			// Fetch the squad for each team and add players
			try {
				await delay(7000) // Additional delay to respect API rate limits
				const squadResponse = await axios.get(`${BASE_URL}/teams/${team.id}`, {
					headers,
				})
				const squad = squadResponse.data.squad

				// Iterate over each player in the squad
				for (const player of squad) {
					const playerData = {
						playerName: player.name,
						playerId: player.id,
						position: player.position,
						dateOfBirth: player.dateOfBirth,
						countryOfBirth: player.countryOfBirth,
						nationality: player.nationality,
						shirtNumber: player.shirtNumber,
						role: player.role,
						team: clubId, // Reference to club's MongoDB _id
					}

					// Save or update player data in the database
					let existingPlayer = await FootballPlayer.findOne({
						playerId: player.id,
					})
					let playerId

					if (existingPlayer) {
						await FootballPlayer.updateOne(
							{ playerId: player.id },
							{ $set: playerData }
						)
						existingPlayer = await FootballPlayer.findOne({
							playerId: player.id,
						}) // Refresh player data
						playerId = existingPlayer._id
						console.log(`Player data updated: ${player.name}`)
					} else {
						const newPlayer = new FootballPlayer(playerData)
						await newPlayer.save()
						playerId = newPlayer._id
						existingPlayer = newPlayer
						console.log(`Player data saved: ${player.name}`)
					}

					// Add player to the club's players array if not already present
					await Club.updateOne(
						{ _id: clubId },
						{ $addToSet: { players: playerId } }
					)

					// Add player to the league's players array if not already present
					await League.updateOne(
						{ leagueId: leagueData.code },
						{ $addToSet: { players: playerId } }
					)
				}
			} catch (error) {
				console.error(
					`Error fetching squad for team ${team.name}:`,
					error.message
				)
			}
		}
	} catch (error) {
		console.error('Error syncing data:', error.message)
		// If an error occurs during the sync, send a 500 response
		res
			.status(500)
			.json({ message: 'Error syncing data.', error: error.message })
	}
}

// Helper function to delay execution by a given number of milliseconds
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

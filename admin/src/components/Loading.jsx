import React from 'react'

export default function Loader({ white }) {
	return <div className={white ? 'white loader' : 'loader'}></div>
}

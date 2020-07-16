import api from '../utils/api'
import signalHandler from '../utils/signalHandler'

export const SET_SYSTEMS_TYPE = Symbol()
export const SET_SYSTEMS_VALUE = Symbol()
export const SET_SYSTEMS_FETCHING = Symbol()
export const SET_SYSTEMS_ERROR = Symbol()

export const setSystemsType = (payload) => ({
	type: SET_SYSTEMS_TYPE,
	payload
})

export const setSystemsValue = (domainId, payload) => ({
	type: SET_SYSTEMS_VALUE,
	domainId,
	payload
})

export const setSystemsFetching = (domainId, payload) => ({
	type: SET_SYSTEMS_FETCHING,
	domainId,
	payload
})

export const setSystemsError = (domainId, payload) => ({
	type: SET_SYSTEMS_ERROR,
	domainId,
	payload
})

export const fetchSystems = signalHandler((signal) => (props, domainId) => async (dispatch) => {

	dispatch(setSystemsFetching(domainId, true))
	dispatch(setSystemsError(domainId))

	try {

		const data = await api({
			query: `
				query fetchSystems($id: ID!, $sorting: Sorting!, $type: SystemType!, $range: Range) {
					domain(id: $id) {
						statistics {
							systems(sorting: $sorting, type: $type, range: $range) {
								id
								count
								created
							}
						}
					}
				}
			`,
			variables: {
				id: domainId,
				sorting: props.filter.sorting,
				type: props.systems.type,
				range: props.filter.range
			},
			props,
			signal: signal(domainId)
		})

		dispatch(setSystemsValue(domainId, data.domain.statistics.systems))
		dispatch(setSystemsFetching(domainId, false))

	} catch (err) {

		if (err.name === 'AbortError') return
		dispatch(setSystemsFetching(domainId, false))
		if (err.name === 'HandledError') return
		dispatch(setSystemsError(domainId, err))

	}

})
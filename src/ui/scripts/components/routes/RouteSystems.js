import { createElement as h, Fragment, useEffect } from 'react'

import selectSystemsValue from '../../selectors/selectSystemsValue'
import enhanceSystems from '../../enhancers/enhanceSystems'
import overviewRoute from '../../utils/overviewRoute'

import CardSystems from '../cards/CardSystems'

const RouteSystems = (props) => {

	useEffect(() => {

		props.domains.value.map((domain) => {
			props.fetchSystems(props, domain.id)
		})

	}, [ props.filter.range, props.domains.value, props.filter.sorting, props.systems.type ])

	return (
		h(Fragment, {},

			props.domains.value.map(
				(domain) => (
					h(CardSystems, {
						key: domain.id,
						headline: domain.title,
						range: props.filter.range,
						sorting: props.filter.sorting,
						loading: props.domains.fetching || selectSystemsValue(props, domain.id).fetching,
						items: enhanceSystems(selectSystemsValue(props, domain.id).value),
						onMore: () => props.setRoute(overviewRoute(domain))
					})
				)
			)

		)
	)

}

export default RouteSystems
import Deal from '../../models/deal.model'
import { LoadDealAction } from './interfaces'
import { LOAD_DEAL } from './types'

export function loadDealAction(deal: Deal): LoadDealAction {
	return {
		type: LOAD_DEAL,
		payload: deal
	}
}
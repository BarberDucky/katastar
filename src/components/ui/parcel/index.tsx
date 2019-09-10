import React, { Component } from 'react'
import { RouterState, Push, push } from 'connected-react-router'
import { match } from 'react-router'
import Parcel from '../../../models/parcel.model'
import { MapStateToProps, connect } from 'react-redux'
import { AppState } from '../../../store'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, bindActionCreators } from 'redux'
import { readParcel } from '../../../services/parcel.service'
import bind from 'bind-decorator'
import styled from 'styled-components'
import { Loader, Segment, Image } from 'semantic-ui-react'
import PatImg from '../../../assets/pat.png'
import { generateIdenticon } from '../../../helper'

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	padding: 2em;
  box-sizing: border-box;
	display: flex;
	flex-direction: column;
`

const TitleImage = styled.div`
	display: flex;
	align-items: center;
  margin-bottom: 2em;
	> * {
		margin-right: 2em;
	}
`

const Title = styled.h3`
  margin: 0;
`

const SegmentWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 2em;
  box-sizing: border-box;
`

const ParcelInfo = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 1.5em;
  }
`

const InfoEntry = styled.div`
  display: flex;
  flex-direction: column;

  > span:last-child {
    font-weight: bold;
    font-size: 1.2em;
  }
`

const Map = styled.div`
`

interface StateProps {
  router: RouterState
}

interface DispatchProps {
  push: Push
}

interface ParamProps {
  parcelId: string
}

interface OwnProps {
  match: match<ParamProps>
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  isLoading: boolean
  results?: Parcel
}

class ParcelPage extends Component<Props, State> {
  _isMounted = false
  state: State = {
    isLoading: true,
    results: undefined,
  }

  public componentDidMount() {
    this._isMounted = true
    this.onRouteChange()
  }

  public componentWillUnmount() {
    this._isMounted = false
  }

  private async onRouteChange() {
    this.setState({isLoading: true})
    const parcel = await readParcel(this.props.match.params.parcelId)

    if (this._isMounted) {
      this.setState({
        isLoading: false,
        results: parcel
      })
    }
  }

  @bind
  private selectOwner(ownerId: string) {
    this.props.push(`/main/users/${ownerId}`)
  }

  render () {
    const parcel = this.state.results
    return (
      <Wrapper>
        <TitleImage>
          <img src={PatImg} alt="explorer" height='64' />
          <Title>Parcel Token</Title>
        </TitleImage>
        {
          this.state.isLoading ? (
            <Loader active />
          ) : !parcel ? (
            'Error loading user.'
          ) : (
            <SegmentWrapper>
              <Segment>
                <ParcelInfo>
                  <TitleImage>
                    <Image src={generateIdenticon(parcel.address)} size='mini'/>
                    <Title>Parcel Info: </Title>
                  </TitleImage>
                  <InfoEntry>
                    <span>Parcel Address</span>
                    <span>{parcel.address}</span>
                  </InfoEntry>
                  <InfoEntry onClick={() => this.selectOwner(parcel.owner)}>
                    <span>Parcel Owner</span>
                    <span>{parcel.owner}</span>
                  </InfoEntry>
                  <InfoEntry>
                    <span>Region</span>
                    <span>{parcel.region}</span>
                  </InfoEntry>
                  <InfoEntry>
                    <span>Municipality</span>
                    <span>{parcel.municipality}</span>
                  </InfoEntry>
                  <InfoEntry>
                    <span>Cadastre Municipality</span>
                    <span>{parcel.cadastreMunicipality}</span>
                  </InfoEntry>
                </ParcelInfo>
                <Map>

                </Map>
              </Segment>
            </SegmentWrapper>
          )
        }
      </Wrapper>
    )
  }

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = state => ({
  router: state.router,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>
  bindActionCreators(
    {
      push,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ParcelPage)
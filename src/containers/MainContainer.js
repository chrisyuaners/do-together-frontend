import React from 'react'
import ControllerContainer from './ControllerContainer'
import GroupContainer from './GroupContainer'
import EventContainer from './EventContainer'
import GroupShow from '../components/GroupShow'
import EventForm from '../components/EventForm'
import GroupForm from '../components/GroupForm'
import AddUsers from '../components/AddUsers'
import { Link, Route, Switch, Redirect } from 'react-router-dom'


export default class MainContainer extends React.Component {

  state = {
    newUsers: [],
    selectedGroup: null,
    selectedEvent: 1,
    newEvent: false,
    showActivityForm: false
  }

  changeToEventForm = () => {
    this.setState({
      newEvent: true
    })
  }


  removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    })
  }

  passUsers = (users, group) => {
    let allUsers = this.removeDuplicates(this.props.groups.map(group => group.users).flat(), "id")
    let newUsers = allUsers.filter(newUser => !users.map(user => user.id).includes(newUser.id))
    this.setState({
      newUsers: newUsers,
      selectedGroup: group
    }, () => {
       this.props.history.push("/groups/add_users")
    })
  }

  addNewActivityForm = (event) => {
    event.preventDefault()
    this.setState({
      showActivityForm: true
    })
  }

  hideActivityForm = (event) => {
    event.preventDefault()
    this.setState({
      showActivityForm: false
    })
  }


  render() {
    console.log(this.state.groups)
    return (
      <div >
        <Switch>

          <Route path="/groups/add_users" render={() => {
            return <AddUsers
                users={this.state.newUsers}
                addUsersToGroup={this.props.addUsersToGroup}
                selectedGroup={this.state.selectedGroup.id}/>
          }} />
          <Route path="/groups/:id" render={(routerProps) => {
            const foundGroup = this.props.groups.find(group => group.id === parseInt(routerProps.match.params.id))
            if (foundGroup) {
              return (
                <GroupShow
                addUser={this.props.addUser}
                selectedGroup={foundGroup}
                handleClick={this.props.selectEvent}
                currentUser={this.props.currentUser}
                removeUser={this.props.removeUser}
                removeGroup={this.props.removeGroup}
                addUsersToGroup={this.props.addUsersToGroup}
                changeToEventForm={this.props.changeToEventForm}
                newEvent={this.props.newEvent}
                groups={this.props.groups}
                passUsers={this.passUsers}
                searchTerm={this.props.searchTerm}
                changeToEventForm={this.changeToEventForm}
                newEvent={this.state.newEvent}
                />
              )
            } else {
              return <Redirect to="/404"/>
            }
          }} />

          <Route path="/groups" render={() => {
            return (
              <>
              < ControllerContainer handleChange={this.props.handleChange} searchTerm={this.props.searchTerm}/>
              < GroupContainer groups={this.props.groups}
               searchTerm={this.props.searchTerm}
               currentUser={this.props.currentUser}
               addUser={this.props.addUser} />
              </>
            )
          }} />
          <Route path="/events/:id/new" render={(routerProps) => {
            debugger
            const foundGroup = this.props.groups.find(group => group.id === parseInt(routerProps.match.params.id))
            return (< EventForm group_id={foundGroup.id} groups={this.props.groups}
                     hideActivityForm={this.hideActivityForm} addNewActivityForm={this.addNewActivityForm}
                     addNewActivity={this.props.addNewActivity}
                     showActivityForm={this.state.showActivityForm}
                     addNewEvent={this.props.addNewEvent}
                     events={this.removeDuplicates(this.props.groups.map(group => group.events).flat(), "id")}
                     activities={this.removeDuplicates(this.props.groups.map(group => group.activities).flat(), "id")}
                    />)
            } } />
          <Route path="/events" render={() => {
            return(
              <>
                < ControllerContainer handleChange={this.props.handleChange} searchTerm={this.props.searchTerm}/>
                < EventContainer
                events={this.props.groups.map(group => group.events).flat()}
                searchTerm={this.props.searchTerm} />
              </>
            )
          }} />
          <Route path="/group_form" render={() =>
            < GroupForm addUser={this.props.addUser}
            addGroup={this.props.addGroup}
            currentUser={this.props.currentUser} />
          } />
          <Route path="/" render={() => {
            return (
              <>
                < ControllerContainer handleChange={this.props.handleChange} search={this.props.searchTerm}/>
                < GroupContainer groups={this.props.groups}
                 searchTerm={this.props.searchTerm}
                 currentUser={this.props.currentUser}
                 addUser={this.props.addUser} />
           </>
         )}} />
        </Switch>
      </div>
    )
  }
}

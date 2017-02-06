import React, { Component } from 'react'
import TemplateTaskForm from '../../molecules/TemplateTaskForm'
import List from '../../atoms/List'
import Button from '../../atoms/Button'
// import styles from './index.css'

export default class TemplateTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTemplateTaskForNoob: false,
      showTemplateTaskForMentor: false,
      currentTemplateTasks: { noob:[],mentor:[] },
      noobTempTaskFormData: {name:'', desc:'', daysToComplete:''},
      mentorTempTaskFormData: {name:'', desc:'', daysToComplete:''}
    }
    this.addTemplateTask = this.addTemplateTask.bind(this)
    this.updateTemplateTask = this.updateTemplateTask.bind(this)
  }

  getTemplateTask() {
    fetch('/api/template_tasks', {
      method: 'get',
      mode: 'cors',
      credentials: 'same-origin'
    }).then( results => {
      return results.json()
    }).then(tasks => {
      this.setState({
        currentTemplateTasks : tasks
      })
    })
  }

  addTemplateTask(event, role){
    const newTemplateTask = this.props.location.query
    newTemplateTask.role = role
    event.preventDefault()
    fetch('/api/template_tasks', {
      method: 'post',
      mode: 'cors',
      credentials: 'same-origin',
      body: JSON.stringify(newTemplateTask),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).then(res => {
    }).then( newTask => {
      this.getTemplateTask()
      this.setState({
        showTemplateTaskForNoob: false,
        showTemplateTaskForMentor: false,
      })
    })
  }

  deteleTemplateTask(event) {
    // fetch('/api/template_tasks')
  }


  handleTempTaskFormFields(event, inputField) {
    if(inputField === 'name'){
      this.props.location.query.template_task_name = event.target.value
    } else if(inputField === 'body'){
      this.props.location.query.template_task_body = event.target.value
    } else if(inputField === 'days_to_complete'){
      this.state.query.template_task_days_to_complete = event.target.value
    }
  }

  toggleTempTaskNoobForm(event) {
    this.setState({
      showTemplateTaskForNoob: !this.state.showTemplateTaskForNoob
    })
  }

  toggleTempTaskMentorForm(event) {
    this.setState({
      showTemplateTaskForMentor: !this.state.showTemplateTaskForMentor
    })
  }

  componentWillMount(){
    this.getTemplateTask()
  }


  render () {
    const noobRenderedForm = this.state.showTemplateTaskForNoob ?
    <TemplateTaskForm
      className={'template_task_form__noob'}
      update={(event, inputField)=>this.handleTempTaskFormFields(event, inputField)}
      submit={(event)=>this.addTemplateTask(event, 'noob')}
      exitForm={this.toggleTempTaskNoobForm.bind(this)}
    />
    :
    <Button onClickEvent={this.toggleTempTaskNoobForm.bind(this)} text='Add Task'/>

    const mentorRenderedForm = this.state.showTemplateTaskForMentor?
      <TemplateTaskForm
        className={'template_task_form__mentor'}
        update={(event, inputField)=>this.handleTempTaskFormFields(event, inputField)}
        submit={(event)=>this.addTemplateTask(event, 'mentor')}
        exitForm={this.toggleTempTaskNoobForm.bind(this)}
      />
    :
    <Button onClickEvent={this.toggleTempTaskMentorForm.bind(this)} text='Add Task'/>

    return (
      <div>
        <div className='container containter-noob'>
        <h1>Template Task for Noobs</h1>
          {noobRenderedForm}
          <List currentTemplateTasks={this.state.currentTemplateTasks.noob} onEditTask={this.updateTemplateTask}/>
        </div>
        <div className='container containter-mentor'>
          <h1>Template Task for Mentors</h1>
          {mentorRenderedForm}
          <List currentTemplateTasks={this.state.currentTemplateTasks.mentor} />
        </div>
      </div>
    )
  }
}

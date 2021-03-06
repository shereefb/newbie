import chai, { expect } from 'chai'
import * as templateTask from '../../src/database/queries/template_task'

describe('templateTask', () => {

  const fakeTemplateTasks = [
    {
      title: 'Massage',
      description: 'Give a senior Learner a foot massage for one hour',
      user_role: 'noob',
      days_to_complete: 7
    },
    {
      title: 'Breath',
      description: 'Take 7 deep breaths',
      user_role: 'mentor',
      days_to_complete: 7
    }
  ]

  const fakeUpdate = {
    title: 'Sing',
    description: 'Sing for 7 hours with no bathroom breaks',
    user_role: 'noob',
    days_to_complete: 3
  }

  beforeEach( () =>
    Promise.all([
      templateTask.deleteAll(),
      templateTask.add(fakeTemplateTasks)
    ])
  )

  it('should exist', () =>
    expect(templateTask).to.be.a('object')
  )

  it('should return all template tasks', () =>
    templateTask.getAll().then( templateTasks => {
      expect( templateTasks[0].title ).to.equal('Massage')
      expect( templateTasks[1].title ).to.equal('Breath')
    })
  )

  it('gets a template task by title', () =>
    templateTask.getBy('title', 'Massage').then( templateTasks =>
      expect(templateTasks[0].user_role).to.equal('noob')
    )
  )

  it('gets a template task by days to complete', () => {
    return templateTask.getBy('days_to_complete', 7).then( templateTasks => {
      expect(templateTasks[0].title).to.equal('Massage')
      expect(templateTasks[1].title).to.equal('Breath')
    })
  })

  it('updates a template task', () =>
    templateTask.update(9, fakeUpdate).then( _ =>
      templateTask.getBy('id', 9).then( updatedTask =>
        expect(updatedTask[0].title).to.equal('Sing')
      )
    )
  )

  it('deletes a templateTask by id', () =>
    templateTask.expunge('id', 11).then( _ =>
      templateTask.getBy('id', 11).then( deletedTask =>
        expect(deletedTask).to.deep.equal([])
      )
    )
  )

})

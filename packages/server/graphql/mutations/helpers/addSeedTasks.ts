import shortid from 'shortid'
import getRethink from '../../../database/rethinkDriver'
import convertToTaskContent from 'parabol-client/utils/draftjs/convertToTaskContent'
import getTagsFromEntityMap from 'parabol-client/utils/draftjs/getTagsFromEntityMap'
import {TaskStatusEnum} from 'parabol-client/types/graphql'

const SEED_TASKS = [
  {
    status: TaskStatusEnum.active,
    sortOrder: 0,
    content: convertToTaskContent(
      `This is a task card. They can be created here, in a meeting, or via an integration`
    )
  }
]

export default async (userId, teamId) => {
  const r = await getRethink()
  const now = new Date()

  const seedTasks = SEED_TASKS.map((proj) => ({
    ...proj,
    id: `${teamId}::${shortid.generate()}`,
    createdAt: now,
    createdBy: userId,
    tags: getTagsFromEntityMap(JSON.parse(proj.content).entityMap),
    teamId,
    userId,
    updatedAt: now
  }))

  return r
    .table('Task')
    .insert(seedTasks, {returnChanges: true})
    .do((result) => {
      return r.table('TaskHistory').insert(
        result('changes').map((change) => ({
          id: shortid.generate(),
          content: change('new_val')('content'),
          taskId: change('new_val')('id'),
          status: change('new_val')('status'),
          teamId: change('new_val')('teamId'),
          userId: change('new_val')('userId'),
          updatedAt: change('new_val')('updatedAt')
        }))
      )
    })
    .run()
}

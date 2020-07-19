import Reflection from 'parabol-server/database/types/Reflection'
import computeDistanceMatrix from './computeDistanceMatrix'
import getAllLemmasFromReflections from './getAllLemmasFromReflections'
import getGroupMatrix from './getGroupMatrix'
import getTitleFromComputedGroup from './getTitleFromComputedGroup'

/*
 * Read each reflection, parse the content for entities (i.e. nouns), group the reflections based on common themes
 */
const groupReflections = (reflections: Reflection[], groupingThreshold: number) => {
  const allReflectionEntities = reflections.map(({entities}) => entities)
  const oldReflectionGroupIds = reflections.map(({reflectionGroupId}) => reflectionGroupId)

  // create a unique array of all entity names mentioned in the meeting's reflect phase
  const uniqueLemmaArr = getAllLemmasFromReflections(allReflectionEntities)
  // create a distance vector for each reflection
  const distanceMatrix = computeDistanceMatrix(allReflectionEntities, uniqueLemmaArr)
  const {groups: groupedArrays, thresh, nextThresh} = getGroupMatrix(
    distanceMatrix,
    groupingThreshold
  )
  // replace the arrays with reflections
  const updatedReflections = [] as Reflection[]
  const updatedGroups = (groupedArrays as any[]).map((group) => {
    // look up the reflection by its vector, put them all in the same group
    let reflectionGroupId = ''
    const groupedReflections = group.map((reflectionDistanceArr, sortOrder) => {
      const idx = distanceMatrix.indexOf(reflectionDistanceArr)
      const reflection = reflections[idx]
      reflectionGroupId = (reflectionGroupId || reflection.reflectionGroupId) as string
      return {
        ...reflection,
        sortOrder,
        reflectionGroupId
      }
    })

    const groupedReflectionEntities = groupedReflections
      .map(({entities}) => entities)
      .filter(Boolean)
    const smartTitle = getTitleFromComputedGroup(
      uniqueLemmaArr,
      group,
      groupedReflectionEntities,
      reflections
    )

    updatedReflections.push(...groupedReflections)
    return {
      id: reflectionGroupId,
      smartTitle,
      title: smartTitle
    }
  })

  const newReflectionGroupIds = new Set(
    updatedReflections.map(({reflectionGroupId}) => reflectionGroupId)
  )
  const removedReflectionGroupIds = oldReflectionGroupIds.filter(
    (groupId) => !newReflectionGroupIds.has(groupId)
  )
  return {
    autoGroupThreshold: thresh,
    groups: updatedGroups,
    groupedReflections: updatedReflections,
    removedReflectionGroupIds,
    nextThresh
  }
}

export default groupReflections

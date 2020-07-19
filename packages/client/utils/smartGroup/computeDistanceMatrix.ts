/*
 * for each entity mentioned in all the reflections,
 * see if it exists for this reflection in particular.
 * if it does, grab the salience, else, set it to 0
 */
import GoogleAnalyzedEntity from 'parabol-server/database/types/GoogleAnalyzedEntity'

const computeDistanceMatrix = (
  reflectionEntities: GoogleAnalyzedEntity[][],
  uniqueLemmaArr: string[]
) => {
  return reflectionEntities.map((entities) => {
    if (!entities) return new Array<number>(uniqueLemmaArr.length).fill(0)
    return uniqueLemmaArr.map((lemma) => {
      const entity = entities.find((ent) => ent.lemma === lemma)
      return entity ? entity.salience : 0
    })
  })
}

export default computeDistanceMatrix

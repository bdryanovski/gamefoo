import Entity from "./entity";

/**
 * Abstract base class for Text and Label alike objects
 *
 * `Text` extends {@link Entity} and could also get all behaviors attach to it but
 * most likely there will be no need for that. Its primary design use case is to
 * keep track of text objects and interact with them
 *
 * @category Entities
 * @since 0.2.0
 * @see {@link Entity} - parent class
 */
export default abstract class Text extends Entity {}

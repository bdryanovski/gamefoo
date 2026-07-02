/**
 * Shared entity union types.
 *
 * Kept separate from {@link generic_types} so that the primitive type
 * module does not need to import from the entity layer.
 *
 * @category Types
 * @since 0.4.0
 */

import type DynamicEntity from './dynamic_entity';
import type Entity from './entity';

/**
 * Union of all entity types that can be managed by the engine's
 * {@link GameObjectRegister}.
 *
 * Covers both static entities ({@link Entity}) and physics-capable
 * entities ({@link DynamicEntity}).
 *
 * @category Types
 * @since 0.1.0
 *
 * @see {@link Entity}        — base abstract entity
 * @see {@link DynamicEntity}  — entity with velocity and speed
 */
export type GameObject = Entity | DynamicEntity;

/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockContextProvider,
	BlockPreview,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';

const TEMPLATE = [ [ 'core/post-comment-content' ] ];

export default function CommentTemplateEdit( { clientId, context: {} } ) {
	const innerBlocksProps = useInnerBlocksProps( {}, { template: TEMPLATE } );
	const blockProps = useBlockProps();

	const [ activeBlockContext, setActiveBlockContext ] = useState();

	const { comments, blocks } = useSelect( ( select ) => {
		const { getEntityRecords } = select( coreStore );
		const { getBlocks } = select( blockEditorStore );
		const postId = select( editorStore ).getCurrentPostId();

		return {
			comments: getEntityRecords( 'root', 'comment', { post: postId } ),
			blocks: getBlocks( clientId ),
		};
	}, [] );

	const blockContexts = useMemo(
		() => comments?.map( ( comment ) => ( { commentId: comment.id } ) ),
		[ comments ]
	);

	if ( ! comments ) {
		return (
			<p { ...blockProps }>
				<Spinner />
			</p>
		);
	}

	if ( ! comments.length ) {
		return <p { ...blockProps }> { __( 'No results found.' ) }</p>;
	}

	return (
		<ul { ...blockProps }>
			{ blockContexts &&
				blockContexts.map( ( blockContext ) => (
					<BlockContextProvider
						key={ blockContext.commentId }
						value={ blockContext }
					>
						{ blockContext ===
						( activeBlockContext || blockContexts[ 0 ] ) ? (
							<li { ...innerBlocksProps } />
						) : (
							<li>
								<BlockPreview
									blocks={ blocks }
									__experimentalLive
									__experimentalOnClick={ () =>
										setActiveBlockContext( blockContext )
									}
								/>
							</li>
						) }
					</BlockContextProvider>
				) ) }
		</ul>
	);
}

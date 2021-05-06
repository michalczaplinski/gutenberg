/**
 * Internal dependencies
 */
import {
	getBlockPaddings,
	getBlockColors,
	parseColorVariables,
	getGlobalStyles,
} from '../utils';

const DEFAULT_COLORS = [
	{ color: '#cd2653', name: 'Accent Color', slug: 'accent' },
	{ color: '#000000', name: 'Primary', slug: 'primary' },
	{ color: '#6d6d6d', name: 'Secondary', slug: 'secondary' },
];

const GLOBAL_STYLES_PALETTE = [
	{
		slug: 'green',
		color: '#D1E4DD',
		name: 'Green',
	},
	{
		slug: 'blue',
		color: '#D1DFE4',
		name: 'Blue',
	},
	{
		slug: 'purple',
		color: '#D1D1E4',
		name: 'Purple',
	},
];

const DEFAULT_GLOBAL_STYLES = {
	settings: {
		color: {
			palette: GLOBAL_STYLES_PALETTE,
			gradients: [
				{
					slug: 'purple-to-blue',
					gradient:
						'linear-gradient(160deg, var(--wp--preset--color--purple), var(--wp--preset--color--blue))',
					name: 'Purple to Blue',
				},
				{
					slug: 'green-to-purple',
					gradient:
						'linear-gradient(160deg, var(--wp--preset--color--green), var(--wp--preset--color--purple))',
					name: 'Green to Purple',
				},
			],
		},
	},
	styles: {
		color: {
			background: 'var(--wp--preset--color--green)',
			text: 'var(--wp--preset--color--blue)',
		},
		elements: {
			link: {
				color: {
					text: 'var(--wp--preset--color--purple)',
				},
			},
		},
	},
};

const PARSED_GLOBAL_STYLES = {
	settings: {
		color: {
			palette: GLOBAL_STYLES_PALETTE,
			gradients: [
				{
					slug: 'purple-to-blue',
					gradient: 'linear-gradient(160deg, #D1D1E4, #D1DFE4)',
					name: 'Purple to Blue',
				},
				{
					slug: 'green-to-purple',
					gradient: 'linear-gradient(160deg, #D1E4DD, #D1D1E4)',
					name: 'Green to Purple',
				},
			],
		},
	},
	styles: {
		color: {
			background: '#D1E4DD',
			text: '#D1DFE4',
		},
		elements: {
			link: {
				color: {
					text: '#D1D1E4',
				},
			},
		},
	},
};

describe( 'getBlockPaddings', () => {
	const PADDING = 12;

	it( 'returns no paddings for a block without background color', () => {
		const paddings = getBlockPaddings(
			{ color: 'red' },
			{ backgroundColor: 'red' },
			{ textColor: 'primary' }
		);
		expect( paddings ).toEqual( expect.objectContaining( {} ) );
	} );

	it( 'returns paddings for a block with background color', () => {
		const paddings = getBlockPaddings(
			{ color: 'red' },
			{},
			{ backgroundColor: 'red', textColor: 'primary' }
		);
		expect( paddings ).toEqual(
			expect.objectContaining( { padding: PADDING } )
		);
	} );

	it( 'returns no paddings for an inner block without background color within a parent block with background color', () => {
		const paddings = getBlockPaddings(
			{ backgroundColor: 'blue', color: 'yellow', padding: PADDING },
			{},
			{ textColor: 'primary' }
		);

		expect( paddings ).toEqual(
			expect.not.objectContaining( { padding: PADDING } )
		);
	} );
} );

describe( 'getBlockColors', () => {
	it( 'returns the theme colors correctly', () => {
		const blockColors = getBlockColors(
			{ backgroundColor: 'accent', textColor: 'secondary' },
			DEFAULT_COLORS
		);
		expect( blockColors ).toEqual(
			expect.objectContaining( {
				backgroundColor: '#cd2653',
				color: '#6d6d6d',
			} )
		);
	} );

	it( 'returns custom background color correctly', () => {
		const blockColors = getBlockColors(
			{ backgroundColor: '#222222', textColor: 'accent' },
			DEFAULT_COLORS
		);
		expect( blockColors ).toEqual(
			expect.objectContaining( {
				backgroundColor: '#222222',
				color: '#cd2653',
			} )
		);
	} );

	it( 'returns custom text color correctly', () => {
		const blockColors = getBlockColors(
			{ textColor: '#4ddddd' },
			DEFAULT_COLORS
		);
		expect( blockColors ).toEqual(
			expect.objectContaining( {
				color: '#4ddddd',
			} )
		);
	} );
} );

describe( 'parseColorVariables', () => {
	it( 'returns the parsed colors values correctly', () => {
		const blockColors = parseColorVariables(
			DEFAULT_GLOBAL_STYLES,
			GLOBAL_STYLES_PALETTE
		);
		expect( blockColors ).toEqual(
			expect.objectContaining( PARSED_GLOBAL_STYLES )
		);
	} );
} );

describe( 'getGlobalStyles', () => {
	it( 'returns the global styles data correctly', () => {
		const globalStyles = getGlobalStyles( DEFAULT_GLOBAL_STYLES );
		const gradients = PARSED_GLOBAL_STYLES.settings.color.gradients;

		expect( globalStyles ).toEqual(
			expect.objectContaining( {
				__experimentalFeatures: {
					defaults: {
						color: { palette: GLOBAL_STYLES_PALETTE, gradients },
					},
				},
				__experimentalGlobalStylesBaseStyles: PARSED_GLOBAL_STYLES,
			} )
		);
	} );
} );

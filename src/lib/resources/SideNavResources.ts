import { Icons } from './IconResources';
export const menus = [
	{
		heading: null,
		links: [
			{
				title: 'Home',
				svg: Icons.houseFilledIcon,
				href: '/'
			}
		]
	},
	{
		heading: 'Attribution',
		links: [
			{
				title: 'Overview',
				svg: Icons.overviewAnalysisIcon,
				href: '/attribution'
			},
			{
				title: 'Events',
				svg: Icons.shoppingCartIcon,
				href: '/attribution/events'
			},
			{
				title: 'Meta',
				svg: Icons.metaBlackLogoIcon,
				href: '/attribution/meta'
			},
			{
				title: 'Google',
				svg: Icons.googleBlackIcon,
				href: ''
			},
			{
				title: 'TikTok',
				svg: Icons.tiktokBlackIcon,
				href: ''
			},
			{
				title: 'Snapchat',
				svg: Icons.snapchatBlackIcon,
				href: ''
			},
			{
				title: 'LinkedIn',
				svg: Icons.linkedInIcon,
				href: ''
			},
			{
				title: 'Taboola',
				svg: Icons.taboolaBlackIcon,
				href: ''
			},
			{
				title: 'Outbrain',
				svg: Icons.outbrainBlackIcon,
				href: ''
			}
		]
	},
	{
		heading: 'Tracking',
		links: [
			{
				title: 'Connections',
				svg: Icons.networkIcon,
				href: '/tracking/connections'
			},
			{
				title: 'Server',
				svg: Icons.serverRacksIcon,
				href: ''
			},
			{
				title: 'Fingerprinting',
				svg: Icons.fingerPrintsIcon,
				href: ''
			}
		]
	},
	{
		heading: 'Data Enrichment',
		links: [
			{
				title: 'Profile Enrichment',
				svg: Icons.singleManCustomerIcon,
				href: ''
			},
			{
				title: 'Geolocation',
				svg: Icons.targetIcon,
				href: ''
			}
		]
	},
	{
		heading: 'Analysis',
		links: [
			{
				title: 'Customer Profiles',
				svg: Icons.threeCustomersSymbolIcon,
				href: '/analysis/customer-profiles'
			},
			{
				title: 'Cohort builder',
				svg: Icons.connection,
				// href: '/analysis/cohorts/'
				href: '/analysis/cohorts/'
			}

		]
	},
	{
		heading: 'Add-Ons',
		links: [
			{
				title: 'Profit Tracker',
				svg: Icons.moneyBag,
				href: '/add-ons/profit-tracker'
			},{
				title: 'Bot Protection',
				svg: Icons.bot,
				href: '/add-ons/bot-protection'
			},
		]
	},
	{
		heading: 'Settings',
		links: [
			{
				title: 'Domains',
				svg: Icons.globalSearchIcon,
				href: '/settings/domains'
			},
			{
				title: 'Trackinglinks',
				svg: Icons.worldWideWebIcon,
				href: ''
			},
			{
				title: 'UTM Builder',
				svg: Icons.threeCubesIcon,
				href: '/utm-builder'
			}
		]
	},
	{
		heading: 'Help Center',
		links: [
			{
				title: 'Help & Support',
				svg: Icons.headphones,
				href: '/help'
			}
		]
	}
];

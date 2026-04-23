module.exports = {
  mySidebar: [
    'index',
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      items: [
        'overview/overview',
        'release-notes',
      ],
    },
    {
      type: 'category',
      label: 'Installation',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'installation/overview',
      },
      items: [
        'installation',
      ],
    },
    {
      type: 'category',
      label: 'Operation',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'operation/overview',
      },
      items: [
        'operation',
      ],
    },
  ],
};

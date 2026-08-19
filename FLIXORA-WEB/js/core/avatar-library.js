// =============================================================
// FLIXORA — Avatar Library (curated categories with portrait rows)
// =============================================================

export const AVATAR_CATEGORIES = [
  {
    name: 'Noir & Luxe',
    key: 'noir',
    fallbacks: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'Bridgerton', query: 'Bridgerton', type: 'tv' },
      { title: 'The Crown', query: 'The Crown', type: 'tv' },
      { title: 'Dark', query: 'Dark', type: 'tv' },
      { title: 'Peaky Blinders', query: 'Peaky Blinders', type: 'tv' },
      { title: 'Money Heist', query: 'Money Heist', type: 'tv' },
      { title: 'The Queen\'s Gambit', query: 'The Queen\'s Gambit', type: 'tv' },
      { title: 'Oppenheimer', query: 'Oppenheimer', type: 'movie' },
      { title: 'Mad Max: Fury Road', query: 'Mad Max: Fury Road', type: 'movie' }
    ]
  },
  {
    name: 'Realeza',
    key: 'royal',
    fallbacks: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'Queen Charlotte', query: 'Queen Charlotte', type: 'tv' },
      { title: 'The Tudors', query: 'The Tudors', type: 'tv' },
      { title: 'The White Queen', query: 'The White Queen', type: 'tv' },
      { title: 'Reign', query: 'Reign', type: 'tv' },
      { title: 'Vikings', query: 'Vikings', type: 'tv' },
      { title: 'The Serpent Queen', query: 'The Serpent Queen', type: 'tv' },
      { title: 'The Crown', query: 'The Crown', type: 'tv' },
      { title: 'The Favourite', query: 'The Favourite', type: 'movie' }
    ]
  },
  {
    name: 'Aventura',
    key: 'adventure',
    fallbacks: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'The Mandalorian', query: 'The Mandalorian', type: 'tv' },
      { title: 'The Witcher', query: 'The Witcher', type: 'tv' },
      { title: 'Stranger Things', query: 'Stranger Things', type: 'tv' },
      { title: 'Dune', query: 'Dune', type: 'movie' },
      { title: 'Avatar', query: 'Avatar', type: 'movie' },
      { title: 'Black Panther', query: 'Black Panther', type: 'movie' },
      { title: 'The Lord of the Rings', query: 'The Lord of the Rings', type: 'movie' },
      { title: 'John Wick', query: 'John Wick', type: 'movie' }
    ]
  },
  {
    name: 'Drama Pop',
    key: 'drama-pop',
    fallbacks: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'Wednesday', query: 'Wednesday', type: 'tv' },
      { title: 'Young Royals', query: 'Young Royals', type: 'tv' },
      { title: 'The Umbrella Academy', query: 'The Umbrella Academy', type: 'tv' },
      { title: 'Heartstopper', query: 'Heartstopper', type: 'tv' },
      { title: 'Ginny & Georgia', query: 'Ginny Georgia', type: 'tv' },
      { title: 'Atypical', query: 'Atypical', type: 'tv' },
      { title: 'Outer Banks', query: 'Outer Banks', type: 'tv' },
      { title: 'The Summer I Turned Pretty', query: 'The Summer I Turned Pretty', type: 'tv' }
    ]
  },
  {
    name: 'Animados',
    key: 'animated',
    fallbacks: [
      'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'Bluey', query: 'Bluey', type: 'tv' },
      { title: 'Paddington', query: 'Paddington', type: 'movie' },
      { title: 'Zootopia', query: 'Zootopia', type: 'movie' },
      { title: 'Toy Story', query: 'Toy Story', type: 'movie' },
      { title: 'Frozen', query: 'Frozen', type: 'movie' },
      { title: 'SpongeBob SquarePants', query: 'SpongeBob SquarePants', type: 'tv' },
      { title: 'Minions', query: 'Minions', type: 'movie' },
      { title: 'The Lion King', query: 'The Lion King', type: 'movie' }
    ]
  },
  {
    name: 'Super Heróis',
    key: 'heroes',
    fallbacks: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'The Flash', query: 'The Flash', type: 'tv' },
      { title: 'The Boys', query: 'The Boys', type: 'tv' },
      { title: 'Arrow', query: 'Arrow', type: 'tv' },
      { title: 'Guardians of the Galaxy', query: 'Guardians of the Galaxy', type: 'movie' },
      { title: 'Spider-Man: Across the Spider-Verse', query: 'Spider-Man: Across the Spider-Verse', type: 'movie' },
      { title: 'Black Panther', query: 'Black Panther', type: 'movie' },
      { title: 'Wonder Woman', query: 'Wonder Woman', type: 'movie' },
      { title: 'The Avengers', query: 'The Avengers', type: 'movie' }
    ]
  },
  {
    name: 'Terror & Mistério',
    key: 'mystery',
    fallbacks: [
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'
    ],
    titles: [
      { title: 'Dark', query: 'Dark', type: 'tv' },
      { title: 'The Fall of the House of Usher', query: 'The Fall of the House of Usher', type: 'tv' },
      { title: 'The Haunting of Hill House', query: 'The Haunting of Hill House', type: 'tv' },
      { title: 'Stranger Things', query: 'Stranger Things', type: 'tv' },
      { title: 'Mindhunter', query: 'Mindhunter', type: 'tv' },
      { title: 'The Purge', query: 'The Purge', type: 'tv' },
      { title: 'Se7en', query: 'Se7en', type: 'movie' },
      { title: 'Prisoners', query: 'Prisoners', type: 'movie' }
    ]
  }
];

export function getAvatarCategoryByKey(key){
  return AVATAR_CATEGORIES.find(cat => cat.key === key);
}

export function getAllCategoryKeys(){
  return AVATAR_CATEGORIES.map(cat => ({ key: cat.key, name: cat.name }));
}

export async function fetchCastForTitle(tmdbClient, title, mediaType) {
  try {
    const results = await tmdbClient.search(title, 1);
    const match = results.find(r => r.media_type === mediaType || !r.media_type);
    if (!match) return [];
    const details = await tmdbClient.details(match.media_type || mediaType, match.id);
    const cast = (details.credits?.cast || [])
      .filter(c => c.profile_path)
      .slice(0, 20)
      .map(c => ({
        name: c.name,
        character: c.character,
        profile_path: c.profile_path
      }));
    return cast;
  } catch (e) {
    console.error('Error fetching cast:', e);
    return [];
  }
}

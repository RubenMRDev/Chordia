import type { Messages } from '../types';

/**
 * English dictionary. Typed as `Messages`, so a key added to `es.ts` and
 * forgotten here fails the build instead of rendering blank.
 */
export const en: Messages = {
  // ---- Chrome ---------------------------------------------------------
  'brand.tagline': 'A real piano, in the browser',
  'nav.play': 'Play',
  'nav.catalog': 'Catalogue',
  'nav.discover': 'Discover',
  'nav.library': 'My library',
  'nav.dashboard': 'Dashboard',
  'nav.tryEditor': 'Try the editor',
  'nav.create': 'Create',
  'nav.profile': 'Profile',
  'nav.signIn': 'Sign in',
  'nav.signUp': 'Create account',
  'nav.signOut': 'Sign out',
  'nav.menu': 'Menu',
  'nav.close': 'Close',
  'nav.skipToContent': 'Skip to content',
  'lang.label': 'Language',
  'lang.switchTo': 'Switch to {name}',

  // ---- Hands ---------------------------------------------------------
  'hand.left': 'Left',
  'hand.right': 'Right',
  'hand.legend': 'Blue is your left hand. Green is your right.',

  // ---- Landing: first viewport ---------------------------------------
  'home.title': 'Write chords. Play them. Share them.',
  'home.lede':
    'Chordia is where you build a progression on the circle of fifths, save it ' +
    'with its key, tempo and time signature, and play it on a multi-sampled ' +
    'piano. With 759 public-domain pieces already inside.',
  'home.ctaPrimary': 'Create an account',
  'home.ctaSecondary': 'Browse the catalogue',
  'home.nowPlaying': 'Play-along mode',
  'home.demoPiece': 'Ode to Joy',
  'home.demoComposer': 'Beethoven · bundled demo',

  // ---- Landing: your piano -------------------------------------------
  'home.piano.title': 'Your piano, not a generic one',
  'home.piano.body':
    'Tell Chordia how many keys your instrument has and it draws that one, ' +
    'exactly that one. The catalogue flags the pieces that will not fit and ' +
    'shifts by octaves the ones that nearly do.',
  'home.piano.pick': 'Pick your keyboard',
  'home.piano.keys': '{count} keys',
  'home.piano.range': '{low} to {high}',
  'home.piano.custom': 'Custom',

  // ---- Landing: compose ----------------------------------------------
  'home.compose.title': 'The chord first, the theory after',
  'home.compose.body':
    'You pick chords on a circle of fifths and Chordia draws each one on the ' +
    'keyboard as you build. The progression saves as a song of your own, with ' +
    'its key, its tempo and its time signature.',
  'home.compose.circle': 'Circle of fifths',
  'home.compose.circleNote': 'Majors outside, minors inside. You choose by pointing.',
  'home.compose.meta': 'Key, tempo and time signature',
  'home.compose.metaNote': 'Every song records what it is played in, not only what is played.',
  'home.compose.ai': 'Chord suggestions',
  'home.compose.aiNote': 'When you do not know where to go next, ask for a continuation.',
  'home.compose.example': 'Example progression',
  'home.compose.cta': 'Create a progression',

  // ---- Landing: the network -------------------------------------------
  'home.network.title': 'And what everyone else writes',
  'home.network.body':
    'What you save goes to your library. What everyone else saves is in ' +
    'Discover, with its author beside it. Profiles carry a bio and links to ' +
    'Instagram, Twitter, SoundCloud and Spotify.',
  'home.network.library': 'My library',
  'home.network.libraryNote': 'Your progressions, sorted and editable.',
  'home.network.discover': 'Discover',
  'home.network.discoverNote': "Every user's songs, and who made them.",
  'home.network.profile': 'Profile',
  'home.network.profileNote': 'Bio, location, website and your socials.',
  'home.network.cta': 'See what is published',

  // ---- Landing: catalogue --------------------------------------------
  'home.catalog.title': 'Seven hundred and fifty-nine pieces, already downloaded',
  'home.catalog.body':
    'A hundred and five composers, all public domain or Creative Commons, ' +
    'each with its source and licence beside it. They ship inside the app: ' +
    'nothing to upload and nothing to wait for.',
  'home.catalog.pieces': 'pieces',
  'home.catalog.browse': 'Browse the whole catalogue',
  'home.catalog.sources':
    'Sources: the Mutopia Project and the CC-licensed files shipped with sightread.',

  // ---- Landing: practice mode ----------------------------------------
  'home.practice.title': 'The clock waits for you',
  'home.practice.body':
    'In practice mode the piece freezes on every note of your hand until you ' +
    'play it right. Choose which hand you play and which hand the app plays; ' +
    'you can sit on the left hand of one nocturne for an hour.',
  'home.practice.waiting': 'Waiting for this note',
  'home.practice.listen': 'Listen',
  'home.practice.listenBody': 'The piece plays through and you accompany it.',
  'home.practice.practice': 'Practise',
  'home.practice.practiceBody': 'The clock stops until you get it right.',

  // ---- Landing: the engine -------------------------------------------
  'home.engine.title': 'It sounds like a piano because it is one',
  'home.engine.body':
    'Not a synth with three samples. A multi-sampled grand over Web Audio, ' +
    'where how hard you strike a key changes both loudness and brightness, ' +
    'the way a real hammer does.',
  'home.engine.samples': 'Salamander Grand samples',
  'home.engine.samplesNote':
    'One every minor third, so no note is stretched more than a semitone.',
  'home.engine.voices': 'voices of polyphony',
  'home.engine.voicesNote':
    'With voice stealing, so a long pedal never cuts the piece off.',
  'home.engine.pedal': 'Sustain pedal',
  'home.engine.pedalNote': 'Over CC64, from your own pedal.',
  'home.engine.spread': 'Stereo spread by pitch',
  'home.engine.spreadNote': 'Bass to the left, as if you were sat at the keys.',

  // ---- Landing: input ------------------------------------------------
  'home.input.title': 'With whatever you have to hand',
  'home.input.midi': 'A MIDI keyboard',
  'home.input.midiBody':
    'Detected on its own, with velocity and pedal. Plug it in and play.',
  'home.input.keyboard': 'The computer keyboard',
  'home.input.keyboardBody':
    'The q w e r and z x c v rows are the piano. Shift is the pedal.',
  'home.input.mouse': 'The mouse',
  'home.input.mouseBody': 'For trying one note without getting up for anything.',

  // ---- Landing: close ------------------------------------------------
  'home.close.title': 'Start your library',
  'home.close.body':
    'Create an account and what you write stays with you: your progressions, ' +
    'your library and your profile. The catalogue and the importer you can try ' +
    'before signing up.',
  'home.close.cta': 'Create an account',
  'home.close.secondary': 'Look at the catalogue first',

  // ---- Footer --------------------------------------------------------
  'footer.rights': '© {year} Chordia',
  'footer.licence':
    'Every piece is public domain or Creative Commons, with its attribution.',
  'footer.product': 'Product',

  // ---- Catalogue browser ---------------------------------------------
  'catalog.title': 'Catalogue',
  'catalog.search': 'Search by title or composer',
  'catalog.composers': '{count} composer|{count} composers',
  'style.Baroque': 'Baroque',
  'style.Classical': 'Classical',
  'style.Romantic': 'Romantic',
  'style.Modern': 'Modern',
  'style.Traditional': 'Traditional',
  'style.Song': 'Song',
  'style.Jazz': 'Jazz',
  'style.March': 'March',
  'style.Hymn': 'Hymn',
  'style.Folk': 'Folk',
  'catalog.composer': 'Composer',
  'catalog.style': 'Style',
  'catalog.difficulty': 'Difficulty',
  'catalog.all': 'All',
  'catalog.fitsOnly': 'Only what fits my piano',
  'catalog.results': '{count} piece|{count} pieces',
  'catalog.empty': 'No piece matches',
  'catalog.emptyBody': 'Try fewer filters, or another composer.',
  'catalog.clear': 'Clear the filters',
  'catalog.tooWide': 'Will not fit your piano',
  'catalog.play': 'Play',
  'catalog.loading': 'Loading the catalogue…',
  'catalog.error': 'The catalogue could not be loaded.',

  'catalog.allComposers': 'All composers',
  'catalog.allStyles': 'All styles',
  'catalog.level': 'Level',
  'catalog.soloPiano': 'Solo piano',
  'catalog.sortComposer': 'By composer',
  'catalog.sortTitle': 'By title',
  'catalog.sortDifficulty': 'By difficulty',
  'catalog.sortDuration': 'By length',
  'catalog.sortLabel': 'Sort',
  'catalog.resultsOf': '{shown} of {total} pieces',
  'catalog.licenceNote': 'all public domain or Creative Commons',
  'catalog.showMore': 'Show more ({count} left)',
  'catalog.doesNotFit': 'will not fit',
  'catalog.doesNotFitTitle':
    'It runs past your piano ({range}); it can be transposed when you open it',
  'catalog.diff1': 'Very easy',
  'catalog.diff2': 'Easy',
  'catalog.diff3': 'Medium',
  'catalog.diff4': 'Hard',
  'catalog.diff5': 'Very hard',
  'catalog.notes': '{count} notes',

  // ---- Import --------------------------------------------------------
  'import.title': 'Import a MIDI file',
  'import.drop': 'Drop a .mid file here',
  'import.or': 'or',
  'import.browse': 'Choose a file',
  'import.note': 'It stays in your browser. Nothing is uploaded.',
  'import.mine': 'My files',
  'import.remove': 'Remove',

  // ---- Player --------------------------------------------------------
  'player.loading': 'Loading the piece…',
  'player.play': 'Play',
  'player.pause': 'Pause',
  'player.restart': 'Start again',
  'player.mode': 'Mode',
  'player.youPlay': 'You play',
  'player.appPlays': 'App plays',
  'player.speed': 'Speed',
  'player.zoom': 'Zoom',
  'player.volume': 'Volume',
  'player.metronome': 'Metronome',
  'player.noteNames': 'Note names',
  'player.fullscreen': 'Full screen',
  'player.exitFullscreen': 'Leave full screen',
  'player.shortcuts': 'Space: play · arrows: 5 s · Esc: leave',
  'player.hits': 'Hits',
  'player.streak': 'Streak',
  'player.accuracy': 'Accuracy',
  'player.saveAsSong': 'Save as a song',
  'player.fitToPiano': 'Fit to my piano',
  'player.fitNote': 'This piece runs {semitones} semitones past your keyboard.',
  'player.notFound': 'That piece cannot be found',
  'player.notFoundBody': 'You may have removed it from this browser.',
  'player.backToCatalog': 'Back to the catalogue',

  'player.best': 'Best',
  'player.bars': 'bar {current} of {total}',
  'player.notes': '{count} notes',
  'player.pianoKeys': '{keys}-key piano',
  'player.pianoKeysTitle': 'Set your piano’s range',
  'player.gone': 'This piece is no longer in this browser’s library',
  'player.cannotOpen': 'The piece could not be opened',
  'player.openLibrary': 'Go to the catalogue',
  'player.samplesLoading':
    'Loading the piano samples ({percent} %). You can already play in the ' +
    'meantime: the fallback synth is sounding.',
  'player.finishedScored':
    'End of the piece: {hits} hit, {wrong} missed, best streak {best}.',
  'player.finishedPlain': 'End of the piece.',
  'player.yourPianoOf': 'your {keys}-key piano ({range})',
  'player.transposedBy': 'Transposed {sign}{octaves} octaves',
  'player.noticeTooWideFixable':
    'This piece uses notes outside {piano}: they sound, but they do not fit on ' +
    'the keyboard. “{action}” shifts it by octaves.',
  'player.noticeTooWide':
    'This piece is wider than {piano}: the notes at the extremes sound, but ' +
    'they do not fit on the keyboard.',
  'player.noticeFits': '{shifted} so it fits {piano}.',
  'player.noticeStillWide':
    '{shifted}, though the piece is wider than {piano} and some notes still ' +
    'fall off the keyboard.',
  'midi.title': 'MIDI keyboard',
  'midi.unsupported':
    'This browser does not support Web MIDI. Try Chrome or Edge, or play with ' +
    'the computer keyboard.',
  'midi.connectedTo':
    'Connected to {names}. Strike velocity and the sustain pedal are both ' +
    'respected.',
  'midi.notDetected': 'No MIDI keyboard detected.',
  'midi.search': 'Scan',

  // ---- Piano settings ------------------------------------------------
  'piano.title': 'Set up my piano',
  'piano.body': 'How many keys the instrument in front of you has.',
  'piano.preset': 'Common keyboards',
  'piano.customRange': 'Custom range',
  'piano.lowest': 'Lowest note',
  'piano.highest': 'Highest note',
  'piano.reset': 'Back to 88 keys',

  'piano.octave': 'Octave',
  'piano.octaveUp': 'Up an octave',
  'piano.octaveDown': 'Down an octave',
  'keyboard.helpTitle': 'Playing with the computer keyboard',
  'keyboard.helpBody':
    'Space plays and pauses, the arrows move by 5 seconds and Shift is the ' +
    'sustain pedal. You can also play the on-screen keys with the mouse.',
  'player.position': 'Position in the piece',

  'piano.fullPiano': 'full piano',
  'piano.octaves': '{count} octave|{count} octaves',
  'piano.mine': 'My piano',
  'piano.customPreset': 'Custom range',
  'piano.saving': 'saving…',
  'piano.savedShort': 'Saved',
  'piano.lede':
    'Pick the keys your keyboard has and play-along mode will draw exactly ' +
    'that piano, instead of adapting to each piece.',
  'piano.autoTitle': 'Transpose pieces that will not fit',
  'piano.autoBody':
    'Shifts the whole piece by octaves so it fits your keyboard. Turn it off ' +
    'and you get a warning instead, with a manual control on each piece.',

  // ---- MIDI device ---------------------------------------------------
  'midi.connected': '{name} connected',
  'midi.none': 'No MIDI keyboard',
  'midi.useComputer': 'Use the q w e r and z x c v rows',
  'midi.troubleshoot': 'My keyboard is not showing up',

  // ---- Auth ----------------------------------------------------------
  'auth.signInTitle': 'Sign in',
  'auth.signUpTitle': 'Create an account',
  'auth.signInLede': 'To get back to your library and your progressions.',
  'auth.signUpLede': 'To save what you write. Playing does not need it.',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.passwordAgain': 'Password again',
  'auth.name': 'What you go by',
  'auth.submitSignIn': 'Sign in',
  'auth.submitSignUp': 'Create the account',
  'auth.working': 'One moment…',
  'auth.noAccount': 'No account yet?',
  'auth.hasAccount': 'Already have an account?',
  'auth.orPlay': 'Or play without one',
  'auth.showPassword': 'Show the password',
  'auth.hidePassword': 'Hide the password',
  'auth.errEmail': 'That email does not look valid.',
  'auth.errPasswordShort': 'The password needs at least six characters.',
  'auth.errPasswordMatch': 'The two passwords do not match.',
  'auth.errWrong': 'That email and password do not match.',
  'auth.errTaken': 'There is already an account with that email.',
  'auth.errNetwork': 'No connection to the server. Try again.',
  'auth.errUnconfigured':
    'This copy of Chordia has no credentials configured, so signing in is ' +
    'not possible. The catalogue and the piano work regardless.',

  'auth.back': 'Back',
  'auth.rememberMe': 'Keep me signed in',
  'auth.forgot': 'Forgotten your password?',
  'auth.forgotNeedEmail': 'Enter your email and we will try again.',
  'auth.forgotSent': 'We have sent an email to {email} so you can change it.',
  'auth.forgotFailed': 'The email could not be sent. Try again.',
  'auth.google': 'Continue with Google',
  'auth.or': 'or',
  'auth.terms':
    'Creating an account means you accept the terms of service and the privacy ' +
    'policy.',
  'auth.errTerms': 'You have to accept the terms to create an account.',
  'auth.perksTitle': 'With an account',
  'auth.perksPlay': 'And playing the catalogue still needs no account.',

  'catalog.pageTitle': 'Pieces to play',
  'catalog.pageLede':
    'Play hundreds of pieces from the catalogue or import your own .mid files, ' +
    'with the notes falling onto the keyboard. A MIDI keyboard, the computer ' +
    'keyboard or the mouse all work.',
  'catalog.yourPiano': 'Your piano: {keys} keys ({range})',
  'catalog.configure': 'set up',
  'catalog.hide': 'hide',
  'import.yourFiles': 'Your imported files',
  'import.builtIn': 'bundled',
  'import.notes': '{count} notes',
  'import.empty': 'Nothing imported yet',
  'import.emptyBody': 'Drop a .mid above and it will show up here.',
  'import.failedTitle': 'Some files could not be imported',
  'import.deleteTitle': 'Delete “{name}”?',
  'import.deleteBody': 'It is removed from this browser. The original file is untouched.',
  'import.deleteFailed': 'It could not be deleted',
  'player.saving': 'Saving…',
  'player.saveNeedsAccount': 'Sign in to save songs',
  'player.saveNeedsAccountBody':
    'Extracting the chords from a MIDI file and saving them needs an account.',
  'player.savedTitle': 'Saved to your library',
  'player.savedBody': '{count} chords extracted from “{name}”.',
  'player.savedView': 'View the song',
  'player.savedStay': 'Stay here',
  'player.saveFailed': 'It could not be saved',
  'player.saveHint': 'Extracts the chords and saves them to your Chordia library',
  'midi.withKeyboardTitle': 'With a MIDI keyboard',
  'midi.withKeyboardBody':
    'Plug it in before opening the piece and it is detected on its own, with ' +
    'strike velocity and a sustain pedal. Without one, the q w e r and ' +
    'z x c v rows are the piano.',
  'state.ok': 'Got it',

  // ---- Songs, libraries and the network -------------------------------
  'songs.noChords': 'No chords saved',
  'songs.chordCount': '{count} chord|{count} chords',
  'songs.newSong': 'Create a song',
  'library.title': 'My library',
  'library.lede': 'The progressions you have saved.',
  'library.empty': 'Your library is empty',
  'library.emptyBody': 'Create your first progression and it will show up here.',
  'library.loadFailed': 'Your songs could not be loaded.',
  'library.deleteTitle': 'Delete “{name}”?',
  'library.deleteBody': 'This cannot be undone.',
  'library.deleteFailed': 'The song could not be deleted',
  'library.deleted': 'Deleted',
  'discover.title': 'Discover',
  'discover.lede': 'What everyone else has published.',
  'discover.empty': 'Nothing published yet',
  'discover.emptyBody': 'Be the first: save a progression and it will show up here.',
  'discover.by': 'by {name}',
  'discover.someone': 'Someone',
  'discover.sortRecent': 'Most recent',
  'discover.sortRandom': 'Shuffle',
  'dashboard.title': 'Hello, {name}',
  'dashboard.lede': 'Where you left off, and what to do next.',
  'dashboard.yourSongs': 'Your songs',
  'dashboard.recent': 'The last things you saved',
  'dashboard.seeAll': 'See the whole library',
  'dashboard.quickPlay': 'Start playing',
  'dashboard.quickPlayBody': 'Open the catalogue and pick a piece.',
  'dashboard.quickCreate': 'Write chords',
  'dashboard.quickCreateBody': 'Build a new progression.',
  'dashboard.quickDiscover': 'See what others made',
  'dashboard.quickDiscoverBody': 'Songs from every user.',
  'dashboard.stat.songs': 'songs of yours',
  'dashboard.stat.chords': 'chords saved',

  'profile.title': 'Profile',
  'profile.edit': 'Edit profile',
  'profile.signOut': 'Sign out',
  'profile.about': 'About',
  'profile.noBio': 'Nothing written here yet.',
  'profile.links': 'Links',
  'profile.location': 'Location',
  'profile.website': 'Website',
  'profile.joined': 'Since {date}',
  'profile.songs': 'Their songs',
  'profile.dangerTitle': 'Delete all my songs',
  'profile.dangerBody':
    'Every progression in your library is deleted. This cannot be undone.',
  'profile.dangerConfirmTitle': 'Delete your {count} songs?',
  'profile.dangerConfirmBody': 'This cannot be undone.',
  'profile.dangerDone': 'Library emptied',
  'profile.dangerFailed': 'They could not be deleted',
  'profile.signOutFailed': 'Signing out failed',
  'profile.admin': 'Manage songs',
  'edit.title': 'Edit profile',
  'edit.lede': 'What everyone else sees on your profile.',
  'edit.name': 'Display name',
  'edit.bio': 'About',
  'edit.bioHint': 'A line or two. It shows on your profile.',
  'edit.location': 'Location',
  'edit.website': 'Website',
  'edit.photo': 'Photo',
  'edit.photoHint': 'An image file. It is uploaded to your account.',
  'edit.social': 'Socials',
  'edit.socialHint': 'Just the username, not the whole URL.',
  'edit.saved': 'Profile saved',
  'edit.saveFailed': 'The profile could not be saved',
  'edit.pianoSection': 'My piano',

  'admin.title': 'Manage songs',
  'admin.lede': 'Every published song, from every user.',
  'admin.deleteTitle': 'Delete “{name}” by {author}?',
  'admin.deleteBody': 'It is deleted for its author too. This cannot be undone.',
  'admin.deleteFailed': 'It could not be deleted',
  'admin.empty': 'No songs published',
  'admin.emptyBody': 'When somebody saves a progression, it will show up here.',
  'admin.loadFailed': 'The songs could not be loaded.',

  // ---- Chord editor and the guided demo -------------------------------
  'editor.demoTitle': 'Chordia demo',
  'editor.songTitle': 'Song title',
  'editor.songTitlePlaceholder': 'My song',
  'editor.parameters': 'Song parameters',
  'editor.key': 'Key',
  'editor.timeSignature': 'Time signature',
  'editor.tempo': 'Tempo (BPM)',
  'editor.selectChords': 'Choose chords',
  'editor.pianoInterface': 'The keyboard',
  'editor.octaves': 'Octaves',
  'editor.octaveOf': 'Octave {n} ({low} – {high})',
  'editor.saveChord': 'Save the chord',
  'editor.updateChord': 'Update the chord',
  'editor.progression': 'The progression',
  'editor.noChords': 'No chords yet. Use the keyboard above to pick notes and make one.',
  'editor.playProgression': 'Hear the progression',
  'editor.stopProgression': 'Stop',
  'editor.fullVersion': 'Open the full editor',
  'editor.signUpPrompt': 'Create an account to save what you write.',
  'editor.tipsTitle': 'In short',
  'editor.tip1': 'Press the keys to pick the notes of the chord.',
  'editor.tip2': 'Hit “Save the chord” to add it to the progression.',
  'editor.tip3': 'The play button plays the whole progression.',
  'editor.tip4': 'Any chord in the progression can be edited or deleted.',
  'editor.saveSong': 'Save the song',
  'editor.needTitle': 'Give the song a title.',
  'editor.needChords': 'Add at least one chord before saving.',
  'editor.saved': 'Song saved',
  'editor.saveFailed': 'The song could not be saved',
  'editor.leaveTitle': 'Leave without saving?',
  'editor.leaveBody': 'If you leave now, the song is not saved.',
  'editor.leaveConfirm': 'Leave without saving',
  'editor.needAccount': 'You have to sign in to save songs',
  'editor.savedNamed': '“{name}” has been saved.',
  'editor.saving': 'Saving…',
  'editor.noChordsShort': 'No chords yet.',
  'editor.readyTitle': 'Ready to write your own songs?',
  'editor.readyConfirm': 'Create an account',
  'editor.readyCancel': 'Stay in the demo',
  'ai.needDescription': 'Describe how it should sound',
  'ai.needDescriptionBody': 'Write a couple of words and it will suggest a progression.',
  'ai.failed': 'It could not be generated',
  'ai.failedBody': 'Generating the progression failed. Try again.',
  // Guided tour
  'tour.welcomeTitle': 'This is Chordia',
  'tour.welcomeBody':
    'This demo shows you how to build your own songs out of chord ' +
    'progressions. Let us go.',
  'tour.paramsTitle': 'The parameters',
  'tour.paramsBody': 'Key, time signature and tempo. They save with the song.',
  'tour.pianoTitle': 'The keyboard',
  'tour.pianoBody': 'Press the keys to pick or drop the notes of the chord.',
  'tour.saveTitle': 'Saving the chord',
  'tour.saveBody':
    'Once you have the notes, save the chord and it joins the progression. ' +
    'You can make as many as you like.',
  'tour.progressionTitle': 'The progression',
  'tour.progressionBody':
    'Your saved chords appear here. They can be edited and deleted.',
  'tour.endTitle': 'Your turn',
  'tour.endBody':
    'Try building your own progression. Close the tour to get started.',
  'tour.previous': 'Previous',
  'tour.next': 'Next',
  'tour.end': 'Close the tour',
  'tour.reopen': 'Show the tour again',

  'song.playYourself': 'Play it myself',
  'song.exitPlayYourself': 'Stop playing it',
  'song.noDevices': 'No MIDI keyboard found',

  'ai.assistant': 'Assistant',
  'ai.placeholder': 'Type your message…',
  'ai.needsPuterLogin': 'You have to sign in to the Puter API to use the chat.',
  'ai.reload': 'Reload the page or check the session.',
  'ai.generatorTitle': 'Generate a progression',
  'ai.describePlaceholder':
    'Describe how it should sound. For example: “a sad progression that builds ' +
    'tension and resolves beautifully” or “energetic rock with a strong drive”.',
  'ai.simple': 'Simple',
  'ai.medium': 'Medium',
  'ai.complex': 'Complex',
  'ai.added': 'The chords have been added to your progression.',
  'midi.troubleshootTitle': 'MIDI troubleshooting',

  'ai.generating': 'Generating…',
  'ai.generate': 'Generate the progression',

  'ai.openChat': 'Open the assistant',
  'ai.closeChat': 'Close the assistant',
  'ai.clearChat': 'Clear the conversation',

  // ---- Generic states ------------------------------------------------
  'state.loading': 'Loading…',
  'state.error': 'Something went wrong',
  'state.errorBody': 'It can be retried without losing anything.',
  'state.retry': 'Try again',
  'state.reload': 'Reload the page',
  'state.cancel': 'Cancel',
  'state.save': 'Save',
  'state.delete': 'Delete',
  'state.back': 'Back',
  'state.notFound': 'This page does not exist',
  'state.notFoundBody': 'The link may be wrong, or the page may have moved.',
  'state.goHome': 'Go to the start',
};

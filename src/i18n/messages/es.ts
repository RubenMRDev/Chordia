/**
 * Spanish dictionary. Source of truth: every key added here must be added to
 * `en.ts` too, or the build fails.
 *
 * Keys are flat and dot-namespaced by surface so they stay greppable from the
 * component that uses them.
 */
export const es = {
  // ---- Chrome ---------------------------------------------------------
  'brand.tagline': 'Piano de verdad, en el navegador',
  'nav.play': 'Tocar',
  'nav.catalog': 'Catálogo',
  'nav.discover': 'Descubrir',
  'nav.library': 'Mi biblioteca',
  'nav.dashboard': 'Panel',
  'nav.tryEditor': 'Probar el editor',
  'nav.create': 'Crear',
  'nav.profile': 'Perfil',
  'nav.signIn': 'Entrar',
  'nav.signUp': 'Crear cuenta',
  'nav.signOut': 'Salir',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar',
  'nav.skipToContent': 'Saltar al contenido',
  'lang.label': 'Idioma',
  'lang.switchTo': 'Cambiar a {name}',

  // ---- Hands: the signal palette, named ------------------------------
  'hand.left': 'Izquierda',
  'hand.right': 'Derecha',
  'hand.legend': 'Azul, mano izquierda. Verde, mano derecha.',

  // ---- Landing: first viewport ---------------------------------------
  'home.title': 'Escribe acordes. Tócalos. Compártelos.',
  'home.lede':
    'Chordia es donde montas una progresión sobre el círculo de quintas, la ' +
    'guardas con su tonalidad, su tempo y su compás, y la tocas sobre un piano ' +
    'multi-muestreado. Con 759 piezas de dominio público ya dentro.',
  'home.ctaPrimary': 'Crear una cuenta',
  'home.ctaSecondary': 'Ver el catálogo',
  'home.nowPlaying': 'Modo de tocar',
  'home.demoPiece': 'Himno a la alegría',
  'home.demoComposer': 'Beethoven · demo incluida',

  // ---- Landing: your piano -------------------------------------------
  'home.piano.title': 'Tu piano, no uno genérico',
  'home.piano.body':
    'Dile a Chordia cuántas teclas tiene tu instrumento y dibuja ese, ' +
    'exactamente ese. El catálogo marca las piezas que no caben y transpone ' +
    'por octavas las que casi caben.',
  'home.piano.pick': 'Elige tu teclado',
  'home.piano.keys': '{count} teclas',
  'home.piano.range': 'De {low} a {high}',
  'home.piano.custom': 'A medida',

  // ---- Landing: compose ----------------------------------------------
  'home.compose.title': 'El acorde primero, la teoría después',
  'home.compose.body':
    'Eliges los acordes sobre un círculo de quintas y Chordia te los dibuja en ' +
    'el teclado mientras los montas. La progresión se guarda como una canción ' +
    'tuya, con tonalidad, tempo y compás.',
  'home.compose.circle': 'Círculo de quintas',
  'home.compose.circleNote': 'Mayores por fuera, menores por dentro. Se elige señalando.',
  'home.compose.meta': 'Tonalidad, tempo y compás',
  'home.compose.metaNote': 'Cada canción guarda en qué se toca, no solo qué se toca.',
  'home.compose.ai': 'Sugerencias de acordes',
  'home.compose.aiNote': 'Cuando no sabes por dónde seguir, pide una continuación.',
  'home.compose.example': 'Progresión de ejemplo',
  'home.compose.cta': 'Crear una progresión',

  // ---- Landing: the network -------------------------------------------
  'home.network.title': 'Y lo que escribe todo el mundo',
  'home.network.body':
    'Lo que guardas va a tu biblioteca. Lo que guardan los demás está en ' +
    'Descubrir, con su autor al lado. Los perfiles llevan bio y enlaces a ' +
    'Instagram, Twitter, SoundCloud y Spotify.',
  'home.network.library': 'Mi biblioteca',
  'home.network.libraryNote': 'Tus progresiones, ordenadas y editables.',
  'home.network.discover': 'Descubrir',
  'home.network.discoverNote': 'Las canciones de todos los usuarios, con quién las hizo.',
  'home.network.profile': 'Perfil',
  'home.network.profileNote': 'Bio, ubicación, web y tus redes.',
  'home.network.cta': 'Ver qué hay publicado',

  // ---- Landing: catalogue --------------------------------------------
  'home.catalog.title': 'Setecientas cincuenta y nueve piezas, ya descargadas',
  'home.catalog.body':
    'Ciento cinco compositores, todo dominio público o Creative Commons, con ' +
    'su fuente y su licencia al lado. Vienen dentro de la aplicación: no hay ' +
    'nada que subir y nada que esperar.',
  'home.catalog.pieces': 'piezas',
  'home.catalog.browse': 'Ver el catálogo entero',
  'home.catalog.sources':
    'Fuentes: Mutopia Project y los archivos con licencia CC de sightread.',

  // ---- Landing: practice mode ----------------------------------------
  'home.practice.title': 'El reloj te espera',
  'home.practice.body':
    'En modo práctica la pieza se congela en cada nota de tu mano hasta que ' +
    'la tocas bien. Elige qué mano tocas tú y qué mano toca la aplicación; ' +
    'puedes quedarte solo con la izquierda de un nocturno durante una hora.',
  'home.practice.waiting': 'Esperando esta nota',
  'home.practice.listen': 'Escuchar',
  'home.practice.listenBody': 'La pieza suena entera y tú acompañas.',
  'home.practice.practice': 'Practicar',
  'home.practice.practiceBody': 'El reloj se para hasta que aciertas.',

  // ---- Landing: the engine -------------------------------------------
  'home.engine.title': 'Suena a piano porque es un piano',
  'home.engine.body':
    'No es un sintetizador con tres muestras. Es un piano de cola ' +
    'multi-muestreado sobre Web Audio, y la velocidad con la que pulsas ' +
    'cambia el volumen y el brillo, como hace un macillo de verdad.',
  'home.engine.samples': 'muestras del Salamander Grand',
  'home.engine.samplesNote':
    'Una cada tercera menor: ninguna nota se estira más de un semitono.',
  'home.engine.voices': 'voces de polifonía',
  'home.engine.voicesNote':
    'Con robo de voz, para que un pedal largo no corte la pieza.',
  'home.engine.pedal': 'Pedal de resonancia',
  'home.engine.pedalNote': 'Por CC64, desde tu propio pedal.',
  'home.engine.spread': 'Apertura estéreo por altura',
  'home.engine.spreadNote': 'Los graves a la izquierda, como sentado al teclado.',

  // ---- Landing: input ------------------------------------------------
  'home.input.title': 'Con lo que tengas a mano',
  'home.input.midi': 'Un teclado MIDI',
  'home.input.midiBody': 'Se detecta solo, con velocidad y pedal. Enchúfalo y toca.',
  'home.input.keyboard': 'El teclado del ordenador',
  'home.input.keyboardBody':
    'Las filas q w e r y z x c v son el piano. Mayúsculas es el pedal.',
  'home.input.mouse': 'El ratón',
  'home.input.mouseBody': 'Para probar una nota sin levantarte a por nada.',

  // ---- Landing: close ------------------------------------------------
  'home.close.title': 'Empieza tu biblioteca',
  'home.close.body':
    'Crea una cuenta y lo que escribas se queda contigo: tus progresiones, tu ' +
    'biblioteca y tu perfil. El catálogo y el importador puedes probarlos ' +
    'antes de registrarte.',
  'home.close.cta': 'Crear una cuenta',
  'home.close.secondary': 'Antes echar un ojo al catálogo',

  // ---- Footer --------------------------------------------------------
  'footer.rights': '© {year} Chordia',
  'footer.licence':
    'Todas las piezas son de dominio público o Creative Commons, con su atribución.',
  'footer.product': 'Producto',

  // ---- Catalogue browser ---------------------------------------------
  'catalog.title': 'Catálogo',
  'catalog.search': 'Buscar por título o compositor',
  'catalog.composers': '{count} compositor|{count} compositores',
  'style.Baroque': 'Barroco',
  'style.Classical': 'Clásico',
  'style.Romantic': 'Romántico',
  'style.Modern': 'Moderno',
  'style.Traditional': 'Tradicional',
  'style.Song': 'Canción',
  'style.Jazz': 'Jazz',
  'style.March': 'Marcha',
  'style.Hymn': 'Himno',
  'style.Folk': 'Folk',
  'catalog.composer': 'Compositor',
  'catalog.style': 'Estilo',
  'catalog.difficulty': 'Dificultad',
  'catalog.all': 'Todos',
  'catalog.fitsOnly': 'Solo lo que cabe en mi piano',
  'catalog.results': '{count} pieza|{count} piezas',
  'catalog.empty': 'Ninguna pieza coincide',
  'catalog.emptyBody': 'Prueba con menos filtros o busca otro compositor.',
  'catalog.clear': 'Quitar los filtros',
  'catalog.tooWide': 'No cabe en tu piano',
  'catalog.play': 'Tocar',
  'catalog.loading': 'Cargando el catálogo…',
  'catalog.error': 'No se ha podido cargar el catálogo.',

  'catalog.allComposers': 'Todos los compositores',
  'catalog.allStyles': 'Todos los estilos',
  'catalog.level': 'Nivel',
  'catalog.soloPiano': 'Solo piano',
  'catalog.sortComposer': 'Por compositor',
  'catalog.sortTitle': 'Por título',
  'catalog.sortDifficulty': 'Por dificultad',
  'catalog.sortDuration': 'Por duración',
  'catalog.sortLabel': 'Ordenar',
  'catalog.resultsOf': '{shown} de {total} piezas',
  'catalog.licenceNote': 'todas de dominio público o Creative Commons',
  'catalog.showMore': 'Mostrar más ({count} restantes)',
  'catalog.doesNotFit': 'no cabe',
  'catalog.doesNotFitTitle':
    'Se sale de tu piano ({range}); se puede transponer al abrirla',
  'catalog.diff1': 'Muy fácil',
  'catalog.diff2': 'Fácil',
  'catalog.diff3': 'Media',
  'catalog.diff4': 'Difícil',
  'catalog.diff5': 'Muy difícil',
  'catalog.notes': '{count} notas',

  // ---- Import --------------------------------------------------------
  'import.title': 'Importar un MIDI',
  'import.drop': 'Suelta aquí un archivo .mid',
  'import.or': 'o',
  'import.browse': 'Elegir un archivo',
  'import.note': 'Se queda en tu navegador. No se sube a ningún sitio.',
  'import.mine': 'Mis archivos',
  'import.remove': 'Quitar',

  // ---- Player --------------------------------------------------------
  'player.loading': 'Cargando la pieza…',
  'player.play': 'Reproducir',
  'player.pause': 'Pausa',
  'player.restart': 'Empezar de nuevo',
  'player.mode': 'Modo',
  'player.youPlay': 'Tocas tú',
  'player.appPlays': 'Suena',
  'player.speed': 'Velocidad',
  'player.zoom': 'Zoom',
  'player.volume': 'Volumen',
  'player.metronome': 'Metrónomo',
  'player.noteNames': 'Nombres de nota',
  'player.fullscreen': 'Pantalla completa',
  'player.exitFullscreen': 'Salir de pantalla completa',
  'player.shortcuts': 'Espacio: play · flechas: 5 s · Esc: salir',
  'player.hits': 'Aciertos',
  'player.streak': 'Racha',
  'player.accuracy': 'Precisión',
  'player.saveAsSong': 'Guardar como canción',
  'player.fitToPiano': 'Ajustar a mi piano',
  'player.fitNote': 'Esta pieza se sale de tu teclado por {semitones} semitonos.',
  'player.notFound': 'No se encuentra esa pieza',
  'player.notFoundBody': 'Puede que la hayas quitado del navegador.',
  'player.backToCatalog': 'Volver al catálogo',

  'player.best': 'Mejor',
  'player.bars': 'compás {current} de {total}',
  'player.notes': '{count} notas',
  'player.pianoKeys': 'piano de {keys} teclas',
  'player.pianoKeysTitle': 'Configurar el rango de tu piano',
  'player.gone': 'Esta pieza ya no está en la biblioteca de este navegador',
  'player.cannotOpen': 'No se ha podido abrir la pieza',
  'player.openLibrary': 'Ir al catálogo',
  'player.samplesLoading':
    'Cargando las muestras del piano ({percent} %). Mientras tanto ya puedes ' +
    'tocar: suena el sintetizador de respaldo.',
  'player.finishedScored':
    'Fin de la pieza: {hits} acertadas, {wrong} falladas, mejor racha {best}.',
  'player.finishedPlain': 'Fin de la pieza.',
  'player.yourPianoOf': 'tu piano de {keys} teclas ({range})',
  'player.transposedBy': 'Transpuesta {sign}{octaves} octavas',
  'player.noticeTooWideFixable':
    'Esta pieza usa notas fuera de {piano}: se oyen, pero no caben en el ' +
    'teclado. Con «{action}» se mueve de octava.',
  'player.noticeTooWide':
    'Esta pieza es más ancha que {piano}: las notas de los extremos se oyen, ' +
    'pero no caben en el teclado.',
  'player.noticeFits': '{shifted} para que entre en {piano}.',
  'player.noticeStillWide':
    '{shifted}, aunque la pieza es más ancha que {piano} y alguna nota se ' +
    'queda fuera del teclado.',
  'midi.title': 'Teclado MIDI',
  'midi.unsupported':
    'Este navegador no soporta Web MIDI. Prueba con Chrome o Edge, o toca con ' +
    'el teclado del ordenador.',
  'midi.connectedTo':
    'Conectado a {names}. Se respeta la velocidad de pulsación y el pedal de ' +
    'resonancia.',
  'midi.notDetected': 'No se ha detectado ningún teclado MIDI.',
  'midi.search': 'Buscar',

  // ---- Piano settings ------------------------------------------------
  'piano.title': 'Configurar mi piano',
  'piano.body': 'Cuántas teclas tiene el instrumento que tienes delante.',
  'piano.preset': 'Teclados habituales',
  'piano.customRange': 'Rango a medida',
  'piano.lowest': 'Nota más grave',
  'piano.highest': 'Nota más aguda',
  'piano.reset': 'Volver a 88 teclas',

  'piano.octave': 'Octava',
  'piano.octaveUp': 'Subir una octava',
  'piano.octaveDown': 'Bajar una octava',
  'keyboard.helpTitle': 'Tocar con el teclado del ordenador',
  'keyboard.helpBody':
    'Espacio reproduce o pausa, las flechas se mueven 5 segundos y Mayúsculas ' +
    'hace de pedal de resonancia. También puedes tocar las teclas de la ' +
    'pantalla con el ratón.',
  'player.position': 'Posición en la pieza',

  'piano.fullPiano': 'piano completo',
  'piano.octaves': '{count} octava|{count} octavas',
  'piano.mine': 'Mi piano',
  'piano.customPreset': 'Rango personalizado',
  'piano.saving': 'guardando…',
  'piano.savedShort': 'Guardado',
  'piano.lede':
    'Elige las teclas que tiene tu teclado y el modo de tocar dibujará ' +
    'exactamente ese piano, en vez de adaptarse a cada pieza.',
  'piano.autoTitle': 'Transponer las piezas que no quepan',
  'piano.autoBody':
    'Sube o baja octavas la pieza entera para que entre en tu teclado. Si lo ' +
    'desactivas, se avisa y puedes ajustarlo a mano en cada pieza.',

  // ---- MIDI device ---------------------------------------------------
  'midi.connected': '{name} conectado',
  'midi.none': 'Sin teclado MIDI',
  'midi.useComputer': 'Usa las filas q w e r y z x c v',
  'midi.troubleshoot': 'Mi teclado no aparece',

  // ---- Auth ----------------------------------------------------------
  'auth.signInTitle': 'Entrar',
  'auth.signUpTitle': 'Crear una cuenta',
  'auth.signInLede': 'Para volver a tu biblioteca y tus progresiones.',
  'auth.signUpLede': 'Para guardar lo que compongas. Tocar no lo necesita.',
  'auth.email': 'Correo',
  'auth.password': 'Contraseña',
  'auth.passwordAgain': 'Repite la contraseña',
  'auth.name': 'Cómo te llamas',
  'auth.submitSignIn': 'Entrar',
  'auth.submitSignUp': 'Crear la cuenta',
  'auth.working': 'Un momento…',
  'auth.noAccount': '¿Todavía no tienes cuenta?',
  'auth.hasAccount': '¿Ya tienes cuenta?',
  'auth.orPlay': 'O toca sin cuenta',
  'auth.showPassword': 'Ver la contraseña',
  'auth.hidePassword': 'Ocultar la contraseña',
  'auth.errEmail': 'Ese correo no parece válido.',
  'auth.errPasswordShort': 'La contraseña necesita al menos seis caracteres.',
  'auth.errPasswordMatch': 'Las dos contraseñas no coinciden.',
  'auth.errWrong': 'El correo o la contraseña no son correctos.',
  'auth.errTaken': 'Ya hay una cuenta con ese correo.',
  'auth.errNetwork': 'No hay conexión con el servidor. Inténtalo otra vez.',
  'auth.errUnconfigured':
    'Esta copia de Chordia no tiene las credenciales configuradas, así que no ' +
    'se puede entrar. El catálogo y el piano funcionan igual.',

  'auth.back': 'Volver',
  'auth.rememberMe': 'Mantener la sesión abierta',
  'auth.forgot': '¿Has olvidado la contraseña?',
  'auth.forgotNeedEmail': 'Escribe tu correo y volvemos a intentarlo.',
  'auth.forgotSent': 'Te hemos enviado un correo a {email} para cambiarla.',
  'auth.forgotFailed': 'No se ha podido enviar el correo. Inténtalo otra vez.',
  'auth.google': 'Continuar con Google',
  'auth.or': 'o',
  'auth.terms':
    'Al crear la cuenta aceptas los términos del servicio y la política de ' +
    'privacidad.',
  'auth.errTerms': 'Hay que aceptar los términos para crear la cuenta.',
  'auth.perksTitle': 'Con una cuenta',
  'auth.perksPlay': 'Y tocar el catálogo sigue sin necesitar cuenta.',

  'catalog.pageTitle': 'Piezas para tocar',
  'catalog.pageLede':
    'Toca cientos de piezas del catálogo o importa tus propios .mid, con las ' +
    'notas cayendo sobre el teclado. Vale un teclado MIDI, el teclado del ' +
    'ordenador o el ratón.',
  'catalog.yourPiano': 'Tu piano: {keys} teclas ({range})',
  'catalog.configure': 'configurar',
  'catalog.hide': 'ocultar',
  'import.yourFiles': 'Tus ficheros importados',
  'import.builtIn': 'incluida',
  'import.notes': '{count} notas',
  'import.empty': 'Todavía no has importado nada',
  'import.emptyBody': 'Suelta un .mid arriba y aparecerá aquí.',
  'import.failedTitle': 'Algún fichero no se ha podido importar',
  'import.deleteTitle': '¿Borrar «{name}»?',
  'import.deleteBody': 'Se quita de este navegador. El fichero original no se toca.',
  'import.deleteFailed': 'No se ha podido borrar',
  'player.saving': 'Guardando…',
  'player.saveNeedsAccount': 'Entra para guardar canciones',
  'player.saveNeedsAccountBody':
    'Extraer los acordes de un MIDI y guardarlos necesita una cuenta.',
  'player.savedTitle': 'Guardada en tu biblioteca',
  'player.savedBody': '{count} acordes extraídos de «{name}».',
  'player.savedView': 'Ver la canción',
  'player.savedStay': 'Seguir aquí',
  'player.saveFailed': 'No se ha podido guardar',
  'player.saveHint': 'Extrae los acordes y la guarda en tu biblioteca de Chordia',
  'midi.withKeyboardTitle': 'Con un teclado MIDI',
  'midi.withKeyboardBody':
    'Conéctalo antes de abrir la pieza y se detecta solo, con velocidad de ' +
    'pulsación y pedal de resonancia. Si no tienes uno, las filas q w e r y ' +
    'z x c v hacen de piano.',
  'state.ok': 'Entendido',

  // ---- Songs, libraries and the network -------------------------------
  'songs.noChords': 'Sin acordes guardados',
  'songs.chordCount': '{count} acorde|{count} acordes',
  'songs.newSong': 'Crear una canción',
  'library.title': 'Mi biblioteca',
  'library.lede': 'Las progresiones que has guardado.',
  'library.empty': 'Tu biblioteca está vacía',
  'library.emptyBody': 'Crea tu primera progresión y aparecerá aquí.',
  'library.loadFailed': 'No se han podido cargar tus canciones.',
  'library.deleteTitle': '¿Borrar «{name}»?',
  'library.deleteBody': 'Esto no se puede deshacer.',
  'library.deleteFailed': 'No se ha podido borrar la canción',
  'library.deleted': 'Borrada',
  'discover.title': 'Descubrir',
  'discover.lede': 'Lo que ha publicado el resto de la gente.',
  'discover.empty': 'Todavía no hay nada publicado',
  'discover.emptyBody': 'Sé el primero: guarda una progresión y aparecerá aquí.',
  'discover.by': 'de {name}',
  'discover.someone': 'Alguien',
  'dashboard.title': 'Hola, {name}',
  'dashboard.lede': 'Por dónde ibas y qué hacer ahora.',
  'dashboard.yourSongs': 'Tus canciones',
  'dashboard.recent': 'Lo último que has guardado',
  'dashboard.seeAll': 'Ver la biblioteca entera',
  'dashboard.quickPlay': 'Ponerte a tocar',
  'dashboard.quickPlayBody': 'Abre el catálogo y elige una pieza.',
  'dashboard.quickCreate': 'Escribir acordes',
  'dashboard.quickCreateBody': 'Monta una progresión nueva.',
  'dashboard.quickDiscover': 'Ver lo de los demás',
  'dashboard.quickDiscoverBody': 'Las canciones de todos los usuarios.',
  'dashboard.stat.songs': 'canciones tuyas',
  'dashboard.stat.chords': 'acordes guardados',

  'profile.title': 'Perfil',
  'profile.edit': 'Editar el perfil',
  'profile.signOut': 'Cerrar sesión',
  'profile.about': 'Sobre mí',
  'profile.noBio': 'Todavía no has escrito nada sobre ti.',
  'profile.links': 'Enlaces',
  'profile.location': 'Ubicación',
  'profile.website': 'Web',
  'profile.joined': 'Desde {date}',
  'profile.songs': 'Sus canciones',
  'profile.dangerTitle': 'Borrar todas mis canciones',
  'profile.dangerBody':
    'Se borran todas las progresiones de tu biblioteca. No se puede deshacer.',
  'profile.dangerConfirmTitle': '¿Borrar tus {count} canciones?',
  'profile.dangerConfirmBody': 'Esto no se puede deshacer.',
  'profile.dangerDone': 'Biblioteca vaciada',
  'profile.dangerFailed': 'No se han podido borrar',
  'profile.signOutFailed': 'No se ha podido cerrar la sesión',
  'profile.admin': 'Gestionar canciones',
  'edit.title': 'Editar el perfil',
  'edit.lede': 'Lo que ve el resto de la gente en tu perfil.',
  'edit.name': 'Nombre visible',
  'edit.bio': 'Sobre mí',
  'edit.bioHint': 'Un par de líneas. Se ve en tu perfil.',
  'edit.location': 'Ubicación',
  'edit.website': 'Web',
  'edit.photo': 'Foto',
  'edit.photoHint': 'Un archivo de imagen. Se sube a tu cuenta.',
  'edit.social': 'Redes',
  'edit.socialHint': 'Solo el nombre de usuario, sin la URL entera.',
  'edit.saved': 'Perfil guardado',
  'edit.saveFailed': 'No se ha podido guardar el perfil',
  'edit.pianoSection': 'Mi piano',

  'admin.title': 'Gestionar canciones',
  'admin.lede': 'Todas las canciones publicadas, de todos los usuarios.',
  'admin.deleteTitle': '¿Borrar «{name}» de {author}?',
  'admin.deleteBody': 'Se borra para su autor también. No se puede deshacer.',
  'admin.deleteFailed': 'No se ha podido borrar',
  'admin.empty': 'No hay ninguna canción publicada',
  'admin.emptyBody': 'Cuando alguien guarde una progresión, aparecerá aquí.',
  'admin.loadFailed': 'No se han podido cargar las canciones.',

  // ---- Chord editor and the guided demo -------------------------------
  'editor.demoTitle': 'Demo de Chordia',
  'editor.songTitle': 'Título de la canción',
  'editor.songTitlePlaceholder': 'Mi canción',
  'editor.parameters': 'Parámetros de la canción',
  'editor.key': 'Tonalidad',
  'editor.timeSignature': 'Compás',
  'editor.tempo': 'Tempo (BPM)',
  'editor.selectChords': 'Elegir acordes',
  'editor.pianoInterface': 'El teclado',
  'editor.octaves': 'Octavas',
  'editor.octaveOf': 'Octava {n} ({low} – {high})',
  'editor.saveChord': 'Guardar el acorde',
  'editor.updateChord': 'Actualizar el acorde',
  'editor.progression': 'La progresión',
  'editor.noChords': 'Todavía no hay acordes. Usa el teclado de arriba para elegir notas y crear uno.',
  'editor.playProgression': 'Escuchar la progresión',
  'editor.stopProgression': 'Parar',
  'editor.fullVersion': 'Abrir el editor completo',
  'editor.signUpPrompt': 'Crea una cuenta para guardar lo que compongas.',
  'editor.tipsTitle': 'En resumen',
  'editor.tip1': 'Pulsa las teclas para elegir las notas del acorde.',
  'editor.tip2': 'Dale a «Guardar el acorde» para añadirlo a la progresión.',
  'editor.tip3': 'Con el botón de play escuchas la progresión entera.',
  'editor.tip4': 'Cualquier acorde de la progresión se puede editar o borrar.',
  'editor.saveSong': 'Guardar la canción',
  'editor.needTitle': 'Ponle un título a la canción.',
  'editor.needChords': 'Añade al menos un acorde antes de guardar.',
  'editor.saved': 'Canción guardada',
  'editor.saveFailed': 'No se ha podido guardar la canción',
  'editor.leaveTitle': '¿Seguro que quieres salir?',
  'editor.leaveBody': 'Si te vas ahora, la canción no se guarda.',
  'editor.leaveConfirm': 'Salir sin guardar',
  'editor.needAccount': 'Hay que entrar para guardar canciones',
  'editor.savedNamed': 'Se ha guardado «{name}».',
  'editor.saving': 'Guardando…',
  'editor.noChordsShort': 'No hay acordes.',
  'editor.readyTitle': '¿Te pones con tus propias canciones?',
  'editor.readyConfirm': 'Crear una cuenta',
  'editor.readyCancel': 'Seguir en la demo',
  'ai.needDescription': 'Describe cómo quieres que suene',
  'ai.needDescriptionBody': 'Escribe un par de palabras y te propongo una progresión.',
  'ai.failed': 'No se ha podido generar',
  'ai.failedBody': 'Ha fallado la generación de la progresión. Inténtalo otra vez.',
  // Guided tour
  'tour.welcomeTitle': 'Esto es Chordia',
  'tour.welcomeBody':
    'Esta demo te enseña a montar tus propias canciones con progresiones de ' +
    'acordes. Vamos.',
  'tour.paramsTitle': 'Los parámetros',
  'tour.paramsBody':
    'La tonalidad, el compás y el tempo. Se guardan con la canción.',
  'tour.pianoTitle': 'El teclado',
  'tour.pianoBody':
    'Pulsa las teclas para elegir o quitar las notas del acorde.',
  'tour.saveTitle': 'Guardar el acorde',
  'tour.saveBody':
    'Cuando tengas las notas, guarda el acorde y se añade a la progresión. ' +
    'Puedes crear todos los que quieras.',
  'tour.progressionTitle': 'La progresión',
  'tour.progressionBody':
    'Aquí aparecen los acordes guardados. Se pueden editar y borrar.',
  'tour.endTitle': 'Ahora tú',
  'tour.endBody':
    'Prueba a montar tu propia progresión. Cierra el tutorial para empezar.',
  'tour.previous': 'Anterior',
  'tour.next': 'Siguiente',
  'tour.end': 'Cerrar el tutorial',
  'tour.reopen': 'Volver a ver el tutorial',

  'song.playYourself': 'Tocarla yo',
  'song.exitPlayYourself': 'Dejar de tocarla',
  'song.noDevices': 'No se ha encontrado ningún teclado MIDI',

  'ai.assistant': 'Asistente',
  'ai.placeholder': 'Escribe tu mensaje…',
  'ai.needsPuterLogin': 'Hay que entrar en la API de Puter para usar el chat.',
  'ai.reload': 'Recarga la página o revisa la sesión.',
  'ai.generatorTitle': 'Generar una progresión',
  'ai.describePlaceholder':
    'Describe cómo quieres que suene. Por ejemplo: «una progresión triste que ' +
    'crea tensión y resuelve bonito» o «rock enérgico con mucho empuje».',
  'ai.simple': 'Simple',
  'ai.medium': 'Media',
  'ai.complex': 'Compleja',
  'ai.added': 'Los acordes se han añadido a tu progresión.',
  'midi.troubleshootTitle': 'Problemas con el MIDI',

  'ai.generating': 'Generando…',
  'ai.generate': 'Generar la progresión',

  'ai.openChat': 'Abrir el asistente',
  'ai.closeChat': 'Cerrar el asistente',
  'ai.clearChat': 'Vaciar la conversación',

  // ---- Generic states ------------------------------------------------
  'state.loading': 'Cargando…',
  'state.error': 'Algo ha salido mal',
  'state.errorBody': 'Se puede volver a intentar sin perder nada.',
  'state.retry': 'Volver a intentarlo',
  'state.reload': 'Recargar la página',
  'state.cancel': 'Cancelar',
  'state.save': 'Guardar',
  'state.delete': 'Borrar',
  'state.back': 'Atrás',
  'state.notFound': 'Esta página no existe',
  'state.notFoundBody':
    'Puede que el enlace esté mal o que la página se haya movido.',
  'state.goHome': 'Ir al principio',
} as const;

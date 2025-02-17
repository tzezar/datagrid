/**
 * A shortcut method for Nostalgist.launch method, with some additional default options
 * for Sega Genesis / Megadrive emulation.
 * 
 * It will use `genesis_plus_gx` as the default core for emulation.
 * 
 * @param {string | File | { fileName: string; fileContent: Blob }} options - The ROM file or options for emulation.
 * If the options is a string or `File` or an object with `fileName` and `fileContent` properties, it will be treated as `{ rom: options }`.
 * If the options is an object, it will be passed directly as options to `Nostalgist.launch`.
 * 
 * @returns {Promise<void>} A promise that resolves when the emulation is started.
 * 
 * @example
 * // Basic usage
 * await Nostalgist.megadrive('30yearsofnintendont.bin');
 * 
 * // Equivalent to:
 * await Nostalgist.launch({ core: 'genesis_plus_gx', rom: '30yearsofnintendont.bin' });
 */
async function megadrive(options) {
  if (typeof options === 'string' || options instanceof File || (options && options.fileName && options.fileContent instanceof Blob)) {
    options = { rom: options };
  }

  // Default core for Sega Genesis / Megadrive emulation
  options.core = options.core || 'genesis_plus_gx';

  // Launch using the Nostalgist.launch method with the prepared options
  await Nostalgist.launch(options);
}

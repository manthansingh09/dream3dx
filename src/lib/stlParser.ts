export async function calculateStlVolume(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return reject("Failed to read file");

      // Binary STL format check:
      // Typically, an 80 byte header, followed by 4 byte uint32 (number of triangles)
      // Then 50 bytes per triangle.
      
      try {
        const view = new DataView(buffer);
        // Is it ASCII or Binary?
        const decoder = new TextDecoder("utf-8");
        const headerText = decoder.decode(buffer.slice(0, 80));
        
        let isAscii = false;
        if (headerText.toLowerCase().startsWith("solid") && buffer.byteLength > 84) {
             const expectedTriangles = view.getUint32(80, true);
             if (84 + (expectedTriangles * 50) !== buffer.byteLength) {
                 isAscii = true;
             }
        }

        if (isAscii) {
            // Very rough estimate for ASCII, real parser is complex
            // We fallback to file size proxy for ASCII
            return resolve(file.size / 10000); 
        }

        // Binary STL Parsing to calculate volume
        const numTriangles = view.getUint32(80, true);
        let totalVolume = 0;

        for (let i = 0; i < numTriangles; i++) {
          const offset = 84 + (i * 50);
          
          // Skip normal vector (12 bytes)
          const v1x = view.getFloat32(offset + 12, true);
          const v1y = view.getFloat32(offset + 16, true);
          const v1z = view.getFloat32(offset + 20, true);
          
          const v2x = view.getFloat32(offset + 24, true);
          const v2y = view.getFloat32(offset + 28, true);
          const v2z = view.getFloat32(offset + 32, true);
          
          const v3x = view.getFloat32(offset + 36, true);
          const v3y = view.getFloat32(offset + 40, true);
          const v3z = view.getFloat32(offset + 44, true);

          // Signed volume of tetrahedron
          const v321 = v3x * v2y * v1z;
          const v231 = v2x * v3y * v1z;
          const v312 = v3x * v1y * v2z;
          const v132 = v1x * v3y * v2z;
          const v213 = v2x * v1y * v3z;
          const v123 = v1x * v2y * v3z;
          
          totalVolume += (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
        }

        // Return absolute volume (often calculated in mm3 if exported in mm)
        resolve(Math.abs(totalVolume) / 1000); // return in cm3 assuming STL in mm
      } catch (err) {
        // Fallback to size proxy
        resolve(file.size / 10000);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// import * as Assimp from 'assimpjs';
//
// export class AssimpLoader {
//     private assimpInstance: Assimp.Assimp;
//
//     constructor() {
//         this.init();
//     }
//
//     private async init() {
//         this.assimpInstance = await Assimp();
//     }
//
//     public async importModel(filePath: string): Promise<Assimp.Scene> {
//         if (!this.assimpInstance) {
//             throw new Error('Assimp is not initialized');
//         }
//         return new Promise((resolve, reject) => {
//             this.assimpInstance.importFile(filePath, (error: Error, scene: Assimp.Scene) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(scene);
//                 }
//             });
//         });
//     }
// }

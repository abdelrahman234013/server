import * as cloudinary from "cloudinary";

export const uploadProductImageService = async (images, res) => {
  let uploadedImages = [];

  try {
    const uploadPromises = images.map(async (image) => {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });
      return { url: result.secure_url, public_id: result.public_id };
    });

    uploadedImages = await Promise.all(uploadPromises); // Wait for all uploads to finish
  } catch (error) {
    console.error("Product Service Error (uploadImageService):", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return uploadedImages;
};

// export const uploadProductImageService = async (images, res) => {
//   let uploadedImages = [];

//   try {
//     for (const image of images) {
//       const result = await cloudinary.v2.uploader.upload(image, {
//         folder: "products",
//       });

//       const data = {
//         url: result.secure_url,
//         public_id: result.public_id,
//       };

//       uploadedImages.push(data);
//     }
//   } catch (error) {
//     console.error("Product Service Error (uploadImageService):", error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }

//   return uploadedImages;
// };

export const updateProductImageService = async (images, product, res) => {
  let updatedImages = [];
  try {
    await Promise.all(
      images.map(async (imgData, index) => {
        if (imgData.url) {
          updatedImages.push(imgData);
        } else {
          if (product.images[index]) {
            await cloudinary.v2.uploader.destroy(
              product.images[index].public_id,
            );
          }

          const result = await cloudinary.v2.uploader.upload(imgData, {
            folder: "products",
          });

          const data = {
            url: result.secure_url,
            public_id: result.public_id,
          };

          updatedImages.push(data);
        }
      }),
    );
  } catch (error) {
    console.error("Product Service Error (updateImageService):", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return updatedImages;
};

export const deleteProductImageService = async (product) => {
  try {
    const productImages = product.images.map((image) => image.public_id);
    await cloudinary.v2.api.delete_resources(productImages);
  } catch (error) {
    console.error("Product Service Error (deleteImageService):", error.message);
  }
};

import { Category } from "../Modal/schemaCategory"
export const category = {
    createCategory: async (req: any, res: any) => {
        const { category, slug } = req.body
        console.log(category, slug, "name slug")
        const finalCategory = new Category({
            name: category,
            slug,
            parent: null,
            children: []
        });
        const saveCategory = await finalCategory.save()
        if (!saveCategory) {
            return res.status(400).json({
                success: false,
                message: "uh, there is thing, try later",
            })
        } else {
            return res.status(200).json({
                success: true,
                data: saveCategory,
            })

        }

    },
    getCategories: async (req: any, res: any) => {
        try {
        
            const resAllCategory = await Category.find({ parent: null }).populate("children")
            return res.status(200).json({
                data: resAllCategory,
                success: true,
            });
        } catch (error: unknown) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }

    },
    getSelectSubCategories :async (req: any, res: any) => {
        try {
            console.log("ddd")
            const resAllCategory = await Category.find()
            return res.status(200).json({
                data: resAllCategory,
                success: true,
            });
        } catch (error: unknown) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }

    },
    updateCategory: async (req: any, res: any) => {
        try {
            const userId = req.params.id;


            const { category, slug } = req.body;
            

            const categoryAfterUpdat = await Category.findOneAndUpdate(
                { _id: userId },
                { $set: {
                    name: category,
                    slug:slug
                }},
                { new: true }
            ); // Return updated user
            if (categoryAfterUpdat == null) {
                return res.status(400).json({
                    message: "This category Is'nt Exist",
                    success: false,
                });
            } else {
                return res.status(200).json({
                    data: categoryAfterUpdat,
                    success: true,
                });
            }
        } catch (error: any) {
            return res.status(200).json({
                message: error.message as string,
                success: false,
            });
        }
    }

    ,
    deleteCategory: async (req: any, res: any) => {
        try {
            const { id } = req.params;
            console.log(id);

            const CategoryDelete = await Category.findById(id);
            if (CategoryDelete == null) {
                return res.status(400).json({
                    message: "the Category isnt exist",
                    success: false,
                });
            }
            if (CategoryDelete !== null) {
                if (CategoryDelete?.children.length > 0) {

                    res.status(400).json({
                        message: "this Category has SubCategories, you cant remove it ",
                        success: false,
                    });
                } else {
                    const CategoryDeleteAfterSure = await Category.findByIdAndDelete(id);
                    console.log(CategoryDeleteAfterSure)
                    res.status(400).json({
                        message: "delete this Category is done ",
                        success: true,
                    });

                }

            } else {
                res.status(402).json({
                    message: "delete Category is falid",
                    success: false,
                });

            }
        } catch (error: unknown) {
            res.status(402).json({
                message: error as string,
                success: false,
            });
        }
    },

    createSubCategory: async (req: any, res: any) => {
        const { id } = req.params
        const { subcategory, slug } = req.body
        console.log(id, "name slug")
        const finalCategory = new Category({
            name: subcategory,
            slug,
            parent: id,
            children: []
        });
        const saveCategory = await finalCategory.save()
        if (!saveCategory) {


            return res.status(400).json({
                success: false,
                message: "uh, there is thing, try later",
            })
        } else {
            const saveSubCategoryAsChildren = await Category.findByIdAndUpdate(id, {
                $push: { children: saveCategory._id }
            }, { new: true })
            console.log(saveSubCategoryAsChildren)
            return res.status(200).json({
                success: true,
                data: saveCategory,
            })

        }

    },
    getSubCategories: async (req: any, res: any) => {
        try {
            const { id } = req.params

            console.log("ddd")
            const resAllCategory = await Category.findById(id).populate('children')
            console.log()
            return res.status(200).json({
                data: resAllCategory?.children,
                success: true,
            });
        } catch (error: unknown) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }

    },
    updateSubCategory: async (req: any, res: any) => {
        try {
            const userId = req.params.id;


            const { subcategory, slug } = req.body;
            

            
            const subcategoryAfterUpdat = await Category.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        name: subcategory,
                        slug:slug
                    }
                },
                { new: true }
            );// Return updated user
            if (subcategoryAfterUpdat == null) {
                return res.status(400).json({
                    message: "This SubCategory Is'nt Exist",
                    success: false,
                });
            } else {
                return res.status(200).json({
                    data: subcategoryAfterUpdat,
                    success: true,
                });
            }
        } catch (error: any) {
            return res.status(200).json({
                message: error.message as string,
                success: false,
            });
        }

    },
    deleteSubCategory: async(req:any,res:any)=>{
        try {
            const { id } = req.params;
            const {parentID} =req.params
            console.log(id);

            const subCategoryDelete = await Category.findById(id);
            if (subCategoryDelete == null) {
                return res.status(400).json({
                    message: "the Category isnt exist",
                    success: false,
                });
            }
            if (subCategoryDelete !== null) {
                if (subCategoryDelete?.children.length > 0) {

                    res.status(400).json({
                        message: "this SubCategory has SubCategories, you cant remove it ",
                        success: false,
                    });
                } else {
                    const CategoryDeleteAfterSure = await Category.findByIdAndDelete(id);
                    const pullSubCategoryFromParent= await Category.updateOne(
                        { _id:parentID  },
                        { $pull: {  children: id } }
                      );

                    console.log(CategoryDeleteAfterSure,pullSubCategoryFromParent)
                    res.status(400).json({
                        message: "delete this Category is done ",
                        success: true,
                    });

                }

            } else {
                res.status(402).json({
                    message: "delete SubCategory is falid",
                    success: false,
                });

            }
        } catch (error: unknown) {
            res.status(402).json({
                message: error as string,
                success: false,
            });
        }

    }
}
import Tour from '../models/Tour.js';
import User from '../models/User.js'; // Assuming you have the User model

//getSingle tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id; // Assuming userId is set by your authentication middleware

    try {
        // Fetch the tour details
        const tour = await Tour.findById(id).populate('reviews');
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found',
            });
        }

        // Find the user and update their recently viewed list
        const user = await User.findById(userId);
        if (user) {
            // Update the recentlyViewed field (add the tour ID, limit to 5 most recent views)
            user.recentlyViewed = [tour.id, ...user.recentlyViewed.filter(tourId => tourId.toString() !== tour.id)].slice(0, 5);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Tour fetched successfully and recently viewed updated',
            data: tour,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// other tour controller functions...

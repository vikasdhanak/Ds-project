// Reviews System - Frontend JavaScript
import { API_BASE_URL } from './config.js';

class ReviewsManager {
    constructor(bookId) {
        this.bookId = bookId;
        this.currentPage = 1;
        this.userReview = null;
        this.selectedRating = 0;
        this.init();
    }

    async init() {
        await this.loadBookReviews();
        await this.loadUserReview();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Star rating click handlers
        const starButtons = document.querySelectorAll('.star-btn');
        starButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.setRating(index + 1));
            btn.addEventListener('mouseenter', () => this.highlightStars(index + 1));
        });

        const starRating = document.querySelector('.star-rating');
        if (starRating) {
            starRating.addEventListener('mouseleave', () => {
                this.highlightStars(this.selectedRating);
            });
        }

        // Submit review form
        const submitBtn = document.getElementById('submit-review-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitReview());
        }

        // Cancel edit
        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }
    }

    setRating(rating) {
        this.selectedRating = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        const starButtons = document.querySelectorAll('.star-btn');
        starButtons.forEach((btn, index) => {
            if (index < rating) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    async loadBookReviews(page = 1) {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${this.bookId}?page=${page}&limit=10`);
            const data = await response.json();

            if (data.success) {
                this.renderReviews(data.data.reviews);
                this.renderPagination(data.data.pagination);
                this.updateReviewsSummary(data.data);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showError('Failed to load reviews');
        }
    }

    async loadUserReview() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/reviews/my-review/${this.bookId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success && data.data) {
                this.userReview = data.data;
                this.populateReviewForm(data.data);
            }
        } catch (error) {
            console.error('Error loading user review:', error);
        }
    }

    populateReviewForm(review) {
        this.selectedRating = review.rating;
        this.highlightStars(review.rating);
        
        const commentInput = document.getElementById('review-comment');
        if (commentInput) {
            commentInput.value = review.comment;
        }

        // Change submit button text
        const submitBtn = document.getElementById('submit-review-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Update Review';
        }
    }

    async submitReview() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to submit a review');
            window.location.href = '/pages/login.html';
            return;
        }

        if (this.selectedRating === 0) {
            alert('Please select a rating');
            return;
        }

        const comment = document.getElementById('review-comment')?.value || '';

        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookId: this.bookId,
                    rating: this.selectedRating,
                    comment
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess(data.message || 'Review submitted successfully');
                await this.loadBookReviews();
                await this.loadUserReview();
            } else {
                this.showError(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            this.showError('Failed to submit review');
        }
    }

    cancelEdit() {
        if (this.userReview) {
            this.populateReviewForm(this.userReview);
        } else {
            this.selectedRating = 0;
            this.highlightStars(0);
            const commentInput = document.getElementById('review-comment');
            if (commentInput) {
                commentInput.value = '';
            }
        }
    }

    renderReviews(reviews) {
        const container = document.getElementById('reviews-list');
        if (!container) return;

        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <div class="no-reviews-icon">📝</div>
                    <div class="no-reviews-text">No reviews yet</div>
                    <div class="no-reviews-subtext">Be the first to review this book!</div>
                </div>
            `;
            return;
        }

        container.innerHTML = reviews.map(review => this.createReviewCard(review)).join('');
        this.attachReviewActions();
    }

    createReviewCard(review) {
        const token = localStorage.getItem('token');
        const currentUser = token ? this.getCurrentUserId() : null;
        const isOwnReview = currentUser && review.userId === currentUser;
        
        const starsHTML = this.generateStarsHTML(review.rating);
        const date = new Date(review.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const initials = review.user.screenName.split(' ').map(n => n[0]).join('').toUpperCase();

        return `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${initials}</div>
                        <div class="reviewer-details">
                            <div class="reviewer-name">${review.user.screenName}</div>
                            <div class="review-date">${date}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${starsHTML}
                    </div>
                </div>
                <div class="review-content">
                    <p class="review-comment">${review.comment || 'No comment provided'}</p>
                </div>
                <div class="review-actions">
                    ${token ? `
                        <button class="helpful-btn" data-review-id="${review.id}">
                            👍 Helpful (${review.helpfulCount || 0})
                        </button>
                    ` : ''}
                    ${isOwnReview ? `
                        <button class="delete-btn" data-review-id="${review.id}">
                            🗑️ Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateStarsHTML(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
        }
        return html;
    }

    attachReviewActions() {
        // Helpful buttons
        document.querySelectorAll('.helpful-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reviewId = e.currentTarget.getAttribute('data-review-id');
                this.markAsHelpful(reviewId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reviewId = e.currentTarget.getAttribute('data-review-id');
                this.deleteReview(reviewId);
            });
        });
    }

    async markAsHelpful(reviewId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to vote');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                await this.loadBookReviews(this.currentPage);
            }
        } catch (error) {
            console.error('Error voting:', error);
            this.showError('Failed to process vote');
        }
    }

    async deleteReview(reviewId) {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Review deleted successfully');
                this.userReview = null;
                this.selectedRating = 0;
                this.highlightStars(0);
                const commentInput = document.getElementById('review-comment');
                if (commentInput) {
                    commentInput.value = '';
                }
                const submitBtn = document.getElementById('submit-review-btn');
                if (submitBtn) {
                    submitBtn.textContent = 'Submit Review';
                }
                await this.loadBookReviews(this.currentPage);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            this.showError('Failed to delete review');
        }
    }

    renderPagination(pagination) {
        const container = document.getElementById('review-pagination');
        if (!container) return;

        container.innerHTML = `
            <button class="pagination-btn" id="prev-page-btn" ${pagination.currentPage === 1 ? 'disabled' : ''}>
                ← Previous
            </button>
            <span class="page-info">Page ${pagination.currentPage} of ${pagination.totalPages}</span>
            <button class="pagination-btn" id="next-page-btn" ${!pagination.hasMore ? 'disabled' : ''}>
                Next →
            </button>
        `;

        document.getElementById('prev-page-btn')?.addEventListener('click', () => {
            if (pagination.currentPage > 1) {
                this.currentPage = pagination.currentPage - 1;
                this.loadBookReviews(this.currentPage);
            }
        });

        document.getElementById('next-page-btn')?.addEventListener('click', () => {
            if (pagination.hasMore) {
                this.currentPage = pagination.currentPage + 1;
                this.loadBookReviews(this.currentPage);
            }
        });
    }

    updateReviewsSummary(data) {
        // Update average rating display
        const ratingNumber = document.getElementById('average-rating-number');
        if (ratingNumber && data.reviews.length > 0) {
            const avgRating = data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length;
            ratingNumber.textContent = avgRating.toFixed(1);
        }

        // Update review count
        const reviewCount = document.getElementById('total-reviews-count');
        if (reviewCount) {
            reviewCount.textContent = `(${data.pagination.totalReviews} ${data.pagination.totalReviews === 1 ? 'review' : 'reviews'})`;
        }
    }

    getCurrentUserId() {
        // Decode JWT token to get user ID (simple version)
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.id;
        } catch {
            return null;
        }
    }

    showSuccess(message) {
        // You can integrate with your existing toast notification system
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

// Export for use in other files
window.ReviewsManager = ReviewsManager;
